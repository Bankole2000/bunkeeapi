const { helpers } = require('../../config/setup');
const Comment = require('../models/Comment');
const CommentReply = require('../models/CommentReply');
const Listing = require('../models/Listing');
const Offer = require('../models/Offer');
const User = require('../models/User');
const { Op } = require('sequelize');

module.exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.findAndCountAll({
      include: [
        {
          model: Comment,
          include: [
            {
              model: CommentReply,
              include: {
                model: User,
                as: 'replier',
                attributes: [
                  'id',
                  'profileImageUrl',
                  'dob',
                  'isAgent',
                  'firstname',
                  'gender',
                  'username',
                  'createdAt',
                ],
              },
            },
            {
              model: User,
              as: 'commenter',
              attributes: [
                'id',
                'profileImageUrl',
                'dob',
                'isAgent',
                'firstname',
                'gender',
                'username',
                'createdAt',
              ],
            },
          ],
        },
        {
          model: User,
          as: 'poster',
          attributes: [
            'id',
            'profileImageUrl',
            'dob',
            'isAgent',
            'firstname',
            'gender',
            'username',
            'createdAt',
          ],
        },
      ],
    });

    offers['rows'].forEach((offer) => {
      offer.dataValues['noOflikes'] = offer.getNoOfLikes();
      offer.dataValues['noOfComments'] = offer.getNoOfComments();
      offer.comments.forEach((comment) => {
        comment.dataValues['noOfLikes'] = comment.getNoOfLikes();
        comment.dataValues['noOfReplies'] = comment.getNoOfReplies();
      });
      // console.log(await offer.getComments());
    });

    res.status(200).json({ message: 'All Offers', offers });
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.getOffersByLocationState = async (req, res) => {
  const noPerPage = 5;
  let offset, limit;
  let { state, page } = req.query;
  page = page ? page : 1;
  offset = (page - 1) * noPerPage;
  limit = offset + noPerPage;
  const stateSearchString = `${state} State`;
  try {
    const offers = await Offer.findAndCountAll({
      where: {
        [Op.or]: [
          { locationState: stateSearchString },
          { locationCity: state },
        ],
        [Op.or]: {
          locationState: {
            [Op.substring]: state,
          },
          locationCity: {
            [Op.substring]: state,
          },
        },
      },
      include: [{ model: Comment, include: [CommentReply] }],
      offset,
      limit,
    });

    res.status(200).json({
      message: `Search for roommate works`,
      offers,
      offset,
      page,
    });
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.createAnOffer = async (req, res) => {
  // Offer.sync({ alter: true });

  const posterId = req.userId;
  const { description, budget, title } = req.body;
  try {
    const offer = await Offer.create({
      description,
      budget,
      title,
      posterId,
    });
    res.status(200).json({ message: 'Created Offer', offer });
  } catch (err) {
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.likeOffer = async (req, res, next) => {
  const { offerId } = req.params;
  const userId = req.userId;
  console.log(offerId, userId);

  try {
    if (offerId) {
      let offer = await Offer.findByPk(offerId);
      if (offer) {
        const likers = offer.likedBy ? JSON.parse(offer.likedBy) : [];
        if (likers.includes(userId)) {
          likers.splice(likers.indexOf(userId), 1);
          const result = await Offer.update(
            { likedBy: likers },
            { where: { id: offerId } }
          );
          if (result[0]) {
            offer = await Offer.findByPk(offerId);
            offer.dataValues['noOfLikes'] = offer.getNoOfLikes();
            res.status(200).json({ message: 'User removed like', offer });
          } else {
            res.status(500).json({ message: 'Unable to update Offer likes' });
          }
        } else {
          likers.push(userId);
          const result = await Offer.update(
            {
              likedBy: likers,
            },
            { where: { id: offerId } }
          );
          if (result[0]) {
            offer = await Offer.findByPk(offerId);
            offer.dataValues['noOfLikes'] = offer.getNoOfLikes();
            res
              .status(200)
              .json({ message: 'New User liked this offer', offer });
          } else {
            res.status(500).json({ message: 'Unable to update Offer likes' });
          }
        }
      } else {
        throw helpers.generateError(
          `No offer with id ${offerId} - Not found`,
          'Offer id'
        );
      }
    } else {
      throw helpers.generateError(
        'No offer Id given in url params',
        'Offer id'
      );
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.likeOfferComment = async (req, res, next) => {
  const { offerId, commentId } = req.params;
  const userId = req.userId;
  try {
    let offer = await Offer.findByPk(offerId);
    if (offer) {
      let comment = await offer.getComments({
        where: { id: commentId, offerId },
      });
      if (comment) {
        const likers = comment[0].likedBy ? JSON.parse(comment[0].likedBy) : [];
        console.log('reached here', {
          likers,
          likedBy: comment.likedBy,
          comment,
        });
        if (likers.includes(userId)) {
          console.log('spliced');
          likers.splice(likers.indexOf(userId), 1);
          console.log({ likers });
          const result = await Comment.update(
            { likedBy: likers },
            { where: { id: commentId, offerId } }
          );
          if (result[0]) {
            comment = await Comment.findOne({
              where: { id: commentId, offerId },
            });
            comment.dataValues['noOfLikes'] = comment.getNoOfLikes();
            comment.dataValues['noOfReplies'] = comment.getNoOfReplies();

            res.status(200).json({
              message: `User ${userId} disliked comment with id ${commentId}`,
              comment,
            });
          } else {
            res.status(500).json({
              message: `Unable to like/dislike comment - Server error`,
            });
          }
        } else {
          likers.push(userId);
          console.log(likers.includes(userId));
          const result = await Comment.update(
            { likedBy: likers },
            { where: { id: commentId, offerId } }
          );
          if (result[0]) {
            comment = await Comment.findOne({
              where: { id: commentId, offerId },
            });
            comment.dataValues['noOfLikes'] = comment.getNoOfLikes();
            comment.dataValues['noOfReplies'] = comment.getNoOfReplies();

            res.status(200).json({
              message: `User ${userId} liked Comment - ${commentId}`,
              comment,
            });
          } else {
            res.status(500).json({
              message: `Unable to like/dislike comment - Server error`,
            });
          }
        }
      } else {
        throw helpers.generateError(
          `No Comment found with id ${commentId}`,
          'Comment Id'
        );
      }
    } else {
      throw helpers.generateError(`No offer found with ${offerId}`, 'Offer Id');
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(404).json(errors);
  }
};

module.exports.likeCommentReply = async (req, res, next) => {
  const { offerId, commentId, replyId } = req.params;
  const userId = req.userId;
  try {
    const comment = await Comment.findOne({
      where: { id: commentId, offerId },
    });
    if (comment) {
      const replyToLike = await CommentReply.findOne({
        where: { id: replyId, commentId },
      });
      if (replyToLike) {
        likers = replyToLike.likedBy ? JSON.parse(replyToLike.likedBy) : [];
        if (likers.includes(userId)) {
          likers.splice(likers.indexOf(userId), 1);
          console.log(likers);
          const result = await CommentReply.update(
            { likedBy: likers },
            { where: { id: replyId, commentId } }
          );
          console.log({ result });
          if (result[0]) {
            const updatedReply = await CommentReply.findOne({
              where: { id: replyId, commentId },
            });
            res.status(200).json({
              message: `User Disliked reply to comment - id ${replyId}`,
              reply: updatedReply,
            });
          } else {
            res.status(500).json({
              message: `Unable to updated reply - ${replyId} likes/dislikes - id ${replyId}`,
            });
          }
        } else {
          likers.push(userId);
          const result = await CommentReply.update(
            { likedBy: likers },
            { where: { id: replyId, commentId } }
          );
          if (result[0]) {
            const udpatedReply = await CommentReply.findOne({
              where: { id: replyId, commentId },
            });
            res.status(200).json({
              message: `User liked reply - ${replyId} to comment - ${commentId}`,
              reply: udpatedReply,
            });
          } else {
            res.status(500).json({
              message: `Unable to update comment reply - Server error`,
            });
          }
        }
      } else {
        throw helpers.generateError(
          `No Reply with that Id - ${replyId}`,
          'Reply Id'
        );
      }
    } else {
      throw helpers.generateError(
        `No Comment with that id - ${commentId} - Not Found`,
        'Comment Id'
      );
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.replyToComment = async (req, res, next) => {
  const { offerId, commentId } = req.params;
  const userId = req.userId;
  const { reply } = req.body;
  try {
    const comment = await Comment.findOne({
      where: { id: commentId, offerId },
      include: [CommentReply],
    });
    if (comment) {
      newReply = await CommentReply.create({
        reply,
        replierId: userId,
      });
      await comment.addCommentReply(newReply);
      res
        .status(201)
        .json({ message: `Your comment reply was added`, comment });
    } else {
      throw helpers.generateError(
        `No Comment with id- ${commentId} - Not Found`,
        'Comment Id'
      );
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(404).json(errors);
  }
};

module.exports.addCommentToOffer = async (req, res) => {
  const commenterId = req.userId;
  const { offerId } = req.params;
  const { comment } = req.body;
  try {
    offer = await Offer.findByPk(offerId, { include: [Comment] });
    if (offer) {
      newComment = await Comment.create({
        commenterId,
        comment,
      });
      await offer.addComment(newComment);
      res.status(200).json({
        message: `Comment added to offer - ${offerId}`,
        newComment,
        offer,
      });
    } else {
      throw helpers.generateError(`No offer with id - ${offerId}`, 'Offer id');
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(404).json(errors);
  }
};

module.exports.getSingleOfferDetails = async (req, res) => {
  const { offerId } = req.params;
  console.log(offerId, req.params);
  try {
    const offer = await Offer.findByPk(offerId, {
      include: { model: Comment, include: { model: CommentReply } },
    });
    if (offer) {
      offer.dataValues['noOfLikes'] = offer.getNoOfLikes();
      offer.dataValues['noOfComments'] = offer.getNoOfComments();
      res
        .status(200)
        .json({ message: `details of Offer with id - ${offerId}`, offer });
    } else {
      res.status(404).json({ message: `No offer with id ${offerId}`, offer });
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.updateOffer = async (req, res) => {
  const { offerId } = req.params;
  console.log(offerId, req.params);
  const id = offerId;
  const updateData = {};
  for (const data of req.body) {
    updateData[data.name] = data.value;
  }
  try {
    const result = await Offer.update(updateData, {
      where: { id },
    });
    if (result[0]) {
      const udpatedOffer = await Offer.findByPk(id, {
        include: { model: Comment, include: [CommentReply] },
      });
      res.status(200).json({
        message: `updated Offer with id - ${id}`,
        offer: udpatedOffer,
      });
    } else {
      res
        .status(404)
        .json(
          { message: `Unable to update Offer with id - ${id}. Not found` },
          offer
        );
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.deleteOffer = async (req, res) => {
  const { offerId } = req.params;
  const { userId } = req;
  const id = offerId;
  try {
    const offer = await Offer.findByPk(id);
    if (offer) {
      if (offer.posterId == userId) {
        await Offer.destroy({
          where: {
            id,
            posterId: userId,
          },
        });
        res.status(200).json({ message: `Delete Offer with Id - ${id}` });
      } else {
        throw helpers.generateError(
          `You don't own this offer`,
          'Auth - actor is not owner'
        );
      }
    } else {
      res.status(404).json({ message: `No offer with id - ${id}`, offer });
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(404).json(errors);
  }
};
