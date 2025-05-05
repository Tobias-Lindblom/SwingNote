const User = require('../models/User');

// Hämtar listor för användarens vänner, mottagna och skickade vänförfrågningar
exports.getFriends = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      
      // Hämta detaljer för alla vänner
      const friends = await User.find({ _id: { $in: user.friends } })
        .select('name email');
      
      // Hämta användare som skickat vänförfrågningar till den inloggade
      const receivedRequests = await User.find({ _id: { $in: user.friendRequests } })
        .select('name email');
      
      // Hämta användare som den inloggade har skickat vänförfrågningar till
      const sentRequests = await User.find({ _id: { $in: user.sentRequests } })
        .select('name email');
      
      res.json({
        friends,
        receivedRequests,
        sentRequests
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Serverfel' });
    }
  };

// Skickar en vänförfrågan till en annan användare
exports.sendFriendRequest = async (req, res) => {
  const { targetUserId } = req.body;
  const currentUser = await User.findById(req.user.id);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) return res.status(404).json({ message: 'Användare finns inte' });

  // Kontrollera om de redan är vänner
  if (currentUser.friends.includes(targetUserId)) {
    return res.status(400).json({ message: 'Ni är redan vänner' });
  }

  // Kontrollera om förfrågan redan har skickats
  if (currentUser.sentRequests.includes(targetUserId)) {
    return res.status(400).json({ message: 'Förfrågan är redan skickad' });
  }

  // Lägg till i respektive lista
  currentUser.sentRequests.push(targetUserId);
  targetUser.friendRequests.push(req.user.id);

  await currentUser.save();
  await targetUser.save();

  res.json({ message: 'Förfrågan skickad' });
};

// Accepterar en mottagen vänförfrågan
exports.acceptFriendRequest = async (req, res) => {
  const fromUserId = req.body.fromUserId;

  const currentUser = await User.findById(req.user.id);
  const fromUser = await User.findById(fromUserId);

  // Lägg till som vänner för båda användarna
  currentUser.friends.push(fromUserId);
  fromUser.friends.push(currentUser._id);

  // Ta bort vänförfrågan från båda håll
  currentUser.friendRequests = currentUser.friendRequests.filter(
    id => id.toString() !== fromUserId
  );
  fromUser.sentRequests = fromUser.sentRequests.filter(
    id => id.toString() !== req.user.id
  );

  await currentUser.save();
  await fromUser.save();

  res.json({ message: 'Vänförfrågan accepterad' });
};

// Tar bort en vän eller avböjer en vänförfrågan (tvåvägs borttagning)
exports.removeFriend = async (req, res) => {
    const friendId = req.params.id;
    const currentUser = await User.findById(req.user.id);
    const otherUser = await User.findById(friendId);
  
    if (!otherUser) {
      return res.status(404).json({ message: 'Användare hittades inte' });
    }
  
    // Ta bort användar-ID från alla relationer i båda användarnas listor
    currentUser.friends = currentUser.friends.filter(id => id.toString() !== friendId);
    currentUser.friendRequests = currentUser.friendRequests.filter(id => id.toString() !== friendId);
    currentUser.sentRequests = currentUser.sentRequests.filter(id => id.toString() !== friendId);
  
    otherUser.friends = otherUser.friends.filter(id => id.toString() !== req.user.id);
    otherUser.friendRequests = otherUser.friendRequests.filter(id => id.toString() !== req.user.id);
    otherUser.sentRequests = otherUser.sentRequests.filter(id => id.toString() !== req.user.id);
  
    await currentUser.save();
    await otherUser.save();
  
    res.json({ message: 'Relation borttagen' });
  };