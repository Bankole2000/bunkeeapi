const { helpers, config } = require('../../config/setup');
const ChatContact = require('../models/ChatContact');
const ChatMessage = require('../models/ChatMessage');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { Op } = require('sequelize');

module.exports.getAllInvites = async (req, res) => {
  try {
    const invites = await ChatContact.findAndCountAll({
      include: [
        { model: User, as: 'inviter' },
        { model: User, as: 'invitee' },
      ],
    });
    res.status(200).json({ message: `All Invites sent`, invites });
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.getUserContacts = async (req, res) => {
  const { userId } = req;
  try {
    const user = await User.findByPk(userId);
    if (user) {
      const contacts = await ChatContact.findAndCountAll({
        where: {
          [Op.or]: [{ inviterId: userId }, { inviteeId: userId }],
        },
        include: [
          { model: User, as: 'inviter' },
          { model: User, as: 'invitee' },
          { model: ChatMessage, as: 'conversation' },
        ],
      });
      res
        .status(200)
        .json({ message: `Here are user ${userId}'s Contacts`, contacts });
    } else {
      throw helpers.generateError(`Unauthorized - please login`, 'userId');
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.getUserMessagesWithChattee = async (req, res) => {
  const { userId } = req;
  const { contactId } = req.params;
  try {
    const user = await User.findByPk(userId);
    if (user) {
      const contact = await ChatContact.findByPk(contactId, {
        include: [{ model: ChatMessage, as: 'conversation' }],
      });
      if (contact) {
        console.log(contact);
        res.status(200).json({
          message: `Chat messages with Contact id - ${contactId}`,
          messages: contact.conversation,
        });
      } else {
        throw helpers.generateError(
          `Contact with id - ${contactId} - Not found`,
          'contactId'
        );
      }
    } else {
      throw helpers.generateError('Unauthorized - Not logged in', 'userId');
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.sendMessageToContact = async (req, res) => {
  const { userId } = req;
  const { contactId } = req.params;
  const { messageText, senderId, recieverId } = req.body;
  console.log({ body: req.body, recieverId, senderId, messageText, contactId });
  try {
    const user = await User.findByPk(userId);
    if (user) {
      const contact = await ChatContact.findByPk(contactId);
      if (contact) {
        newChatMessage = await ChatMessage.create({
          messageText,
          senderId: senderId || userId,
          recieverId,
          conversationId: contactId,
        });
        // updatedContact = await ChatContact.findByPk(contactId, {
        //   include: [{ model: ChatMessage, as: 'conversation' }],
        // });
        // console.log(updatedContact);
        res.status(200).json({
          message: `Chat Message sent`,
          messageContent: newChatMessage,
        });
      } else {
        throw helpers.generateError(
          `No such Contact - ${contactId} Not Found`,
          'contactId'
        );
      }
    } else {
      throw helpers.generateError(`Unauthenticated - Please Login`, 'userId');
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.sendChatInvite = async (req, res) => {
  const { userId } = req;
  let { chatteeId } = req.params;
  chatteeId = parseInt(chatteeId, 10);
  console.log({ userId, chatteeId });
  try {
    if (userId == chatteeId) {
      throw helpers.generateError(
        `Cannot send Invite to self - ${userId} to ${chatteeId}`,
        'userId & chatteeId'
      );
    }
    const user = await User.findByPk(userId);
    if (user) {
      const chattee = await User.findByPk(chatteeId);
      if (chattee) {
        const previouslyBlocked = await ChatContact.findOne({
          where: {
            [Op.or]: {
              [Op.and]: [
                { inviterId: userId },
                { inviteeId: chatteeId },
                { isBlocked: true },
              ],
              [Op.and]: [
                { inviterId: chatteeId },
                { inviterId: userId },
                { isBlocked: true },
              ],
            },
          },
          include: [
            { model: User, as: 'inviter' },
            { model: User, as: 'invitee' },
          ],
        });
        if (previouslyBlocked) {
          console.log('previously Blocked');
          if (previouslyBlocked.blockedBy == user.id) {
            res
              .status(401)
              .json({ message: `Blocked by you`, invite: previouslyBlocked });
          } else if (previouslyBlocked.blockedBy == chattee.id) {
            res.status(401).json({
              success: false,
              message: `Blocked by contact`,
              invite: previouslyBlocked,
            });
          }
        } else {
          console.log('Not Previously Blocked');
          const alreadyInvited = await ChatContact.findOne({
            where: {
              [Op.or]: {
                [Op.and]: [{ inviterId: userId }, { inviteeId: chatteeId }],
                // [Op.and]: [{ inviterId: chatteeId }, { inviteeId: userId }],
              },
            },
            include: [
              { model: User, as: 'inviter' },
              { model: User, as: 'invitee' },
            ],
          });
          console.log({ alreadyInvited });
          if (alreadyInvited) {
            console.log('Already Invited');
            if (alreadyInvited.hasBeenDeclined) {
              console.log('Invite has been declined');
              res.status(200).json({
                success: false,
                message: `Chattee already declined Invitation`,
                invite: alreadyInvited,
              });
            } else if (alreadyInvited.hasBeenAccepted) {
              console.log('Invite Has been accepted');
              res.status(200).json({
                success: false,
                message: `This User is already in your contacts`,
                invite: alreadyInvited,
              });
            } else {
              console.log('Invite not yet responded to');
              res.status(200).json({
                success: false,
                message: `Already Invited but still pending`,
                invite: alreadyInvited,
              });
            }
          } else {
            const alreadyBeenInvited = await ChatContact.findOne({
              where: {
                [Op.or]: {
                  // [Op.and]: [{ inviterId: userId }, { inviteeId: chatteeId }],
                  [Op.and]: [{ inviterId: chatteeId }, { inviteeId: userId }],
                },
              },
              include: [
                { model: User, as: 'inviter' },
                { model: User, as: 'invitee' },
              ],
            });
            if (alreadyBeenInvited) {
              console.log('Already Been Invited');
              if (alreadyBeenInvited.hasBeenDeclined) {
                console.log('You already declined this invite');
                res.status(200).json({
                  success: false,
                  message: `You already declined Invitation`,
                  invite: alreadyBeenInvited,
                });
              } else if (alreadyBeenInvited.hasBeenAccepted) {
                console.log('You already accepted this invite');
                res.status(200).json({
                  success: false,
                  message: `This User is already in your contacts`,
                  invite: alreadyBeenInvited,
                });
              } else {
                console.log('User yet to responded to this invite');
                res.status(200).json({
                  success: false,
                  message: `Already Invited but still pending`,
                  invite: alreadyBeenInvited,
                });
              }
            } else {
              console.log('Creating invite');
              const invite = await ChatContact.create({
                inviterId: userId,
                inviteeId: chatteeId,
              });
              const createdInvite = await ChatContact.findByPk(invite.id, {
                include: [
                  { model: User, as: 'inviter' },
                  { model: User, as: 'invitee' },
                  { model: ChatMessage, as: 'conversation' },
                ],
              });
              const newNotification = await Notification.create({
                notificationType: 'chatInvite',
                senderId: createdInvite.inviterId,
                recieverId: createdInvite.inviteeId,
                notificationText: `sent you a Chat Invite`,
                notificationAction: `open Chat`,
                notificationUrl: null,
                associatedUsers: [
                  createdInvite.inviterId,
                  createdInvite.inviteeId,
                ],
              });
              const createdNotification = await Notification.findByPk(
                newNotification.id,
                {
                  include: [
                    { model: User, as: 'sender' },
                    { model: User, as: 'reciever' },
                  ],
                }
              );
              // user.addChatContact(invite);
              // chattee.addChatContact(invite);
              res.status(201).json({
                message: `Invite Sent`,
                success: true,
                invite: createdInvite,
                notification: createdNotification,
              });
            }
          }
        }
      } else {
        throw helpers.generateError(
          `No user with that id - ${chatteeId} - Not Found`,
          'chatteeId'
        );
      }
    } else {
      throw helpers.generateError(
        `Unauthorized - ${userId} - Not Found`,
        'userId'
      );
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.pingInvitee = async (req, res) => {
  const { userId } = req;
  const { contactId, recieverId } = req.params;
  try {
    const user = await User.findByPk(userId);
    if (user) {
      const contact = await ChatContact.findByPk(contactId);
      if (contact) {
        const pingMessage = await ChatMessage.create({
          messageText: `Ping! 👋`,
          senderId: userId,
          recieverId,
          conversationId: contact.id,
          hasBeenDelivered: false,
        });
        console.log(pingMessage);
        res
          .status(200)
          .json({ message: `Pinged User - ${recieverId}`, pingMessage });
      } else {
        throw helpers.generateError(
          `Contact with id - ${contactId} - Not found`,
          'contactId'
        );
      }
    } else {
      throw helpers.generateError('Unauthorized - Not logged in', 'userId');
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.respondToChatInvite = async (req, res) => {
  const { userId } = req;
  const { inviteId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (user) {
      const invite = await ChatContact.findByPk(inviteId);
      if (invite) {
        if (invite.inviteeId == user.id) {
          const updateData = {};
          for (const data of req.body) {
            updateData[data.name] = data.value;
          }
          //
          if (
            (updateData.hasBeenAccepted || updateData.hasBeenDeclined) &&
            user.id == invite.inviteeId
          ) {
            const result = await ChatContact.update(updateData, {
              where: { id: inviteId },
            });
            if (result[0]) {
              const updatedInvite = await ChatContact.findByPk(inviteId, {
                include: [
                  { model: User, as: 'inviter' },
                  { model: User, as: 'invitee' },
                  { model: ChatMessage, as: 'conversation' },
                ],
              });
              let notificationText = `${
                updateData.hasBeenAccepted ? 'accepted' : 'declined'
              } your chat invite ${
                updatedInvite.hasBeenAccepted ? '👍✅' : '👎❌'
              }`;
              if (updatedInvite.hasBeenAccepted) {
                const newNotification = await Notification.create({
                  notificationType: 'chatInvite',
                  senderId: updatedInvite.inviteeId,
                  recieverId: updatedInvite.inviterId,
                  notificationText,
                  notificationAction: `open Chat`,
                  notificationUrl: null,
                  associatedUsers: [
                    updatedInvite.inviterId,
                    updatedInvite.inviteeId,
                  ],
                });
                const createdNotification = await Notification.findByPk(
                  newNotification.id,
                  {
                    include: [
                      { model: User, as: 'sender' },
                      { model: User, as: 'reciever' },
                    ],
                  }
                );
                res.status(200).json({
                  message: `updated Invite with id - ${inviteId}`,
                  invite: updatedInvite,
                  accepted: true,
                  declined: false,
                  notification: createdNotification,
                });
              } else if (updatedInvite.hasBeenDeclined) {
                res.status(200).json({
                  message: `updated Invite with id - ${inviteId}`,
                  invite: updatedInvite,
                  accepted: false,
                  declined: true,
                });
              }
            } else {
              throw helpers.generateError(
                `Unable to Update Invite - Server Error`,
                'Server Error'
              );
            }
          } else {
            const result = await ChatContact.update(updateData, {
              where: { id: inviteId },
            });
            if (result[0]) {
              const updatedInvite = await ChatContact.findByPk(inviteId, {
                include: [
                  { model: User, as: 'inviter' },
                  { model: User, as: 'invitee' },
                  { model: ChatMessage, as: 'conversation' },
                ],
              });
              res.status(200).json({
                message: `updated Invite with id - ${inviteId}`,
                invite: updatedInvite,
              });
            } else {
              throw helpers.generateError(
                `Unable to Update Invite - Server Error`,
                'Server Error'
              );
            }
          }
        } else {
          throw helpers.generateError(
            `This user is not involved in this invite`,
            'userId'
          );
        }
      } else {
        throw helpers.generateError(
          `Invite with id - ${inviteId} - Not Found`,
          'inviteId'
        );
      }
    } else {
      throw helpers.generateError(`Unauthenticated - Login`, 'userId');
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.deleteChatInvite = async (req, res) => {
  const { userId } = req;
  const { inviteId } = req.params;
  try {
    const user = await User.findByPk(userId);
    if (user) {
      const invite = await ChatContact.findByPk(inviteId);

      if (invite) {
        if (user.id == invite.inviterId || invite.inviteeId == user.id) {
          ChatContact.destroy({
            where: {
              id: invite.id,
              [Op.and]: {
                [Op.or]: [{ inviterId: user.id }, { inviteeId: user.id }],
              },
            },
          });
          res
            .status(200)
            .json({ message: `Invite Deleted - id - ${inviteId}` });
        } else {
          throw helpers.generateError(`You don't own this Invite`, 'userId');
        }
      } else {
        throw helpers.generateError(
          `Invite with id ${inviteId} - Not Found`,
          'inviteId'
        );
      }
    } else {
      throw helpers.generateError('Unauthorized', 'userId');
    }
  } catch (err) {
    console.log(err);
    let errors = helpers.handleErrors(err);
    res.status(400).json(errors);
  }
};
