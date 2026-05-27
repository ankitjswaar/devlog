import axios from 'axios';
import User from '../models/User.js';
import Post from '../models/Post.js';
import { generateToken } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const LINKEDIN_API = 'https://api.linkedin.com/v2';

const getLinkedInScopes = () => ['openid', 'profile', 'email', 'w_member_social'];
const safeString = (value) => {
  if (typeof value === 'string') return value;
  if (value == null) return '';
  if (typeof value === 'object') {
    if (typeof value.localized === 'string') return value.localized;
    if (typeof value.value === 'string') return value.value;
    return JSON.stringify(value);
  }
  return String(value);
};

export const getAuthUrl = async (req, res, next) => {
  try {
    const state = Buffer.from(
      JSON.stringify({ userId: req.user._id.toString() })
    ).toString('base64url');

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.LINKEDIN_CLIENT_ID,
      redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
      state,
      scope: getLinkedInScopes().join(' '),
    });

    res.json({
      success: true,
      url: `${LINKEDIN_AUTH_URL}?${params.toString()}`,
    });
  } catch (error) {
    next(error);
  }
};

export const handleCallback = async (req, res, next) => {
  try {
    const { code, state, error, error_description } = req.query;

    if (error) {
      return res.redirect(
        `${process.env.CLIENT_URL}/linkedin/callback?error=${encodeURIComponent(error_description || error)}`
      );
    }

    if (!code || !state) {
      return res.redirect(
        `${process.env.CLIENT_URL}/linkedin/callback?error=${encodeURIComponent('Missing authorization code')}`
      );
    }

    let userId;
    try {
      const parsed = JSON.parse(Buffer.from(state, 'base64url').toString());
      userId = parsed.userId;
    } catch {
      return res.redirect(
        `${process.env.CLIENT_URL}/linkedin/callback?error=${encodeURIComponent('Invalid state')}`
      );
    }

    const tokenResponse = await axios.post(
      LINKEDIN_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token, expires_in, refresh_token } = tokenResponse.data;

    // Prefer OpenID userinfo; fallback to legacy /me endpoint for broader app setups.
    let profile = null;
    let linkedinPersonId = null;

    try {
      const profileResponse = await axios.get(`${LINKEDIN_API}/userinfo`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      profile = profileResponse.data;
      linkedinPersonId = profile?.sub || null;
    } catch (userinfoError) {
      const meResponse = await axios.get(`${LINKEDIN_API}/me`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      profile = meResponse.data;
      linkedinPersonId = profile?.id || null;
    }

    const user = await User.findById(userId).select('+linkedinAccessToken');
    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/linkedin/callback?error=${encodeURIComponent('User not found')}`
      );
    }

    if (!linkedinPersonId) {
      throw new AppError('Could not read LinkedIn profile id from callback', 500);
    }

    user.linkedinId = linkedinPersonId;
    user.linkedinAccessToken = access_token;
    if (refresh_token) user.linkedinRefreshToken = refresh_token;
    user.linkedinTokenExpiry = new Date(Date.now() + expires_in * 1000);
    user.linkedinProfile = {
      name:
        profile?.name ||
        `${profile?.localizedFirstName || ''} ${profile?.localizedLastName || ''}`.trim() ||
        `${profile?.given_name || ''} ${profile?.family_name || ''}`.trim(),
      picture: safeString(profile?.picture) || null,
      headline: safeString(profile?.headline || profile?.locale),
    };
    await user.save();

    const jwt = generateToken(user._id);

    res.redirect(
      `${process.env.CLIENT_URL}/linkedin/callback?token=${jwt}&connected=true`
    );
  } catch (error) {
    const raw = error.response?.data || error.message;
    const linkedInMessage =
      error.response?.data?.error_description ||
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Failed to connect LinkedIn';
    console.error('LinkedIn callback error:', raw);
    res.redirect(
      `${process.env.CLIENT_URL}/linkedin/callback?error=${encodeURIComponent(linkedInMessage)}`
    );
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      connected: !!user.linkedinId && !!user.linkedinAccessToken,
      profile: user.linkedinProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const postToLinkedIn = async (req, res, next) => {
  try {
    const { postId, content } = req.body;

    const user = await User.findById(req.user._id).select('+linkedinAccessToken');

    if (!user.linkedinAccessToken || !user.linkedinId) {
      throw new AppError('LinkedIn not connected. Please connect your account first.', 400);
    }

    let postContent = content;
    let post;

    if (postId) {
      post = await Post.findOne({ _id: postId, userId: req.user._id });
      if (!post) throw new AppError('Post not found', 404);
      postContent = post.generatedPost;
    }

    if (!postContent?.trim()) {
      throw new AppError('No content to post', 400);
    }

    const authorUrn = `urn:li:person:${user.linkedinId}`;

    const ugcResponse = await axios.post(
      `${LINKEDIN_API}/ugcPosts`,
      {
        author: authorUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text: postContent },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${user.linkedinAccessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );

    const linkedinPostId = ugcResponse.data?.id;

    if (post) {
      post.postedToLinkedIn = true;
      post.linkedinPostId = linkedinPostId;
      await post.save();
    } else if (postId) {
      await Post.findByIdAndUpdate(postId, {
        postedToLinkedIn: true,
        linkedinPostId,
      });
    }

    res.json({
      success: true,
      message: 'Posted to LinkedIn successfully',
      linkedinPostId,
    });
  } catch (error) {
    const linkedInError = error.response?.data;
    console.error('LinkedIn post error:', linkedInError || error.message);

    if (error.response?.status === 401) {
      return next(
        new AppError('LinkedIn token expired. Please reconnect your account.', 401)
      );
    }

    const message =
      linkedInError?.message ||
      linkedInError?.errorDetails?.inputErrors?.[0]?.description ||
      'Failed to post to LinkedIn';

    next(new AppError(message, error.response?.status || 500));
  }
};

export const disconnectLinkedIn = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+linkedinAccessToken');
    user.linkedinId = null;
    user.linkedinAccessToken = null;
    user.linkedinRefreshToken = null;
    user.linkedinTokenExpiry = null;
    user.linkedinProfile = undefined;
    await user.save();

    res.json({ success: true, message: 'LinkedIn disconnected' });
  } catch (error) {
    next(error);
  }
};
