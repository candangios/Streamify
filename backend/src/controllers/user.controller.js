import FriendRequest from "../models/FriendRequest.js"
import User from "../models/User.js"

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id
    const currentUser = req.user
    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // exclude current user
        { $id: { $nin: currentUser.friends } }, //exclude current user's friends
        { isOnboarded: true }
      ]
    })
    res.status(200).json(recommendedUsers)
  } catch (error) {
    console.log('Error in getRecommended controller:', error)
    res.status(500).json({ message: 'Internal server error!' })
  }

}
export async function getFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select('friends')
      .populate('friends', 'fullName, profilePic nativeLanguage, learningLanguage')
    res.status(200).json(user.friends)
  } catch (error) {
    console.log('Error in user friends controller:', error)
    res.status(500).json({ message: 'Internal server error!' })
  }
}
export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id
    const { id: recipientId } = req.params
    // prevent sending req to yourself
    if (myId === recipientId) {
      return res.status(400).json({ message: `You can't send friend request to yourself!` })
    }
    const recipient = await User.findById(recipientId)
    if (!recipient) {
      return res.status(400).json({ message: `User not found!` })
    }
    // check if user already friends
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ message: `You are already friend with this user!` })
    }
    // check id a request already exists
    const existsRequest = FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ]
    })
    if (existsRequest) {
      res.status(400).json({ message: 'A friend request already exists between you and thud user!' })
    }
    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    })
    res.status(200).json(friendRequest)

  } catch (error) {
    console.log('Error in user send request frend request controller:', error)
    res.status(500).json({ message: 'Internal server error!' })
  }
}
export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params
    const friendRequest = await FriendRequest.findById(requestId)
    if (!friendRequest) {
      res.status(400).json({ message: 'Friend request not found!' })
    }

    if (friendRequest.recipient.toString() !== req.user.id) {
      res.status(400).json({ message: 'You are not authorized to acept this request!' })
    }
    friendRequest.status == 'accepted'
    await friendRequest.save()
    // add cach user to the other's friends array

    // addToSet: adds elements to an array only if they do not already exists
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient }
    })
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender }
    })
    res.status(200).json({ message: 'friend request accepted' })

  } catch (error) {
    console.log('Error in acceptFriendRequest controller:', error)
    res.status(500).json({ message: 'Internal server error!' })
  }
}
export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: 'pending'
    }).populate('sender', 'fullName, profilePic nativeLanguage, learningLanguage')
    const acceptedReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: 'acccepted'
    }).populate('sender', 'fullName, profilePic nativeLanguage, learningLanguage')
    res.status(200).json({ incomingReqs, acceptedReqs })

  } catch (error) {
    console.log('Error in user get friend requests:', error)
    res.status(500).json({ message: 'Internal server error!' })
  }
}
export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: 'pending'
    }).populate('recipient', 'fullName, profilePic nativeLanguage, learningLanguage')
    res.status(200).json(outgoingRequests)
  } catch (error) {
    console.log('Error in user get out going friend requests:', error)
    res.status(500).json({ message: 'Internal server error!' })
  }
}