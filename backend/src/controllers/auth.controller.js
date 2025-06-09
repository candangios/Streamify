import { upsertStreamUser } from "../lib/stream.js"
import User from "../models/User.js"
import jwt from 'jsonwebtoken'

export async function signup(req, res) {
  const { email, fullName, password } = req.body

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'All fields are required!' })
    }
    if (password.lenght < 6) {
      return res.status(400).json({ message: ' Password must be at least 6 characters' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already exists, please use a diffent one' })
    }
    const idx = Math.floor(Math.random() * 100) + 1 // generate a mun between 1-100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`
    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar
    })
    // todo regex email format

    // todo create the user in stream as well

    await upsertStreamUser({
      id: newUser._id.toString(),
      name: newUser.fullName,
      image: newUser.profilePic || ''
    })


    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '7d'
    })
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 100,
      httpOnly: true, //prevent ZSS attack
      sameSite: 'strict', //prevent CSRF acttack
      secure: process.env.NODE_ENV === 'production'
    })
    res.status(201).json({ success: true, user: newUser })

  } catch (error) {
    console.log(' Error in signup controller', error)
    res.status(500).json({ message: 'Internal server error!' })
  }
}
export async function login(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required!' })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password!' })
    }
    const isPasswordCorrect = await user.matchPassword(password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid ema\il or password!' })
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '7d'
    })
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 100,
      httpOnly: true, //prevent ZSS attack
      sameSite: 'strict', //prevent CSRF acttack
      secure: process.env.NODE_ENV === 'production'
    })
    res.status(201).json({ success: true, user: user })

  } catch (error) {
    console.log(' Error in signup controller', error)
    res.status(500).json({ message: 'Internal server error!' })
  }
}
export async function logout(req, res) {
  res.clearCookie("token")
  res.status(200).json({ success: true, message: ' Logout successful' })
}
export async function me(req, res) {
  try {
    const user = req.user
    res.status(200).json({ success: true, user: user })
  } catch (error) {
    console.log('Onboarding error:', error)
    res.status(500).json({ message: 'Internal server error!' })
  }
}

export async function onboard(req, res) {
  try {
    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body
    const userId = req.user.id
    if (!fullName, !bio, !nativeLanguage, !learningLanguage, !location) {
      return res.status(400).json({
        message: 'All fields is required',
        missingFields: [
          !fullName && 'fullName',
          !bio && 'bio',
          !nativeLanguage && 'nativelanguage',
          !learningLanguage && 'learningLanguage',
          !location && 'location']
      })
    }
    const updateUser = await User.findByIdAndUpdate(userId, {
      ...req.body,
      isOnboarded: true
    }, { new: true })

    await upsertStreamUser({
      id: updateUser._id.toString(),
      name: updateUser.fullName,
      image: updateUser.profilePic || ''
    })



    if (!updateUser) { return res.status(404).json({ message: 'User not found!' }) }


    res.status(200).json({ success: true, user: updateUser })
  } catch (error) {
    console.log('Onboarding error:', error)
    res.status(500).json({ message: 'Internal server error!' })
  }
}