const User = require('../api/models/User');
const ChatMessage = require('../api/models/ChatMessage');
const userMethods = {};

userMethods.updateUserSocketDisconnected = async (socketId) => {
  const user = await User.findOne({ where: { currentSocketId: socketId } });
  if (user) {
    await User.update(
      {
        isOnline: false,
        lastSeen: new Date().toISOString(),
        currentSocketId: null,
      },
      { where: { id: user.id } }
    );
    const updatedUser = await User.findByPk(user.id);
    // console.log(socketId);
    return updatedUser;
  } else {
    return false;
  }
};

userMethods.updateLoggedInStatus = async (userId, status, socketId = null) => {
  await User.update(
    {
      isOnline: status,
      lastSeen: new Date().toISOString(),
      currentSocketId: socketId,
    },
    { where: { id: userId } }
  );

  const updatedUser = await User.findByPk(userId);
  return updatedUser;
};

userMethods.allChatRead = async (
  conversationId,
  senderId,
  hasBeenDelivered,
  hasBeenRead
) => {
  console.log({ conversationId, senderId, hasBeenDelivered, hasBeenRead });
  await ChatMessage.update(
    {
      hasBeenDelivered,
      hasBeenRead,
    },
    {
      where: { conversationId, senderId },
    }
  );
};

module.exports = { userMethods };
