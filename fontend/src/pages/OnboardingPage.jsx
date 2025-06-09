import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { completeOnboarding } from '../lib/api'
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from 'lucide-react'
import { LANGUAGES } from '../constants'

function OnboardingPage() {
  const { authUser } = useAuthUser()
  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || '',
    bio: authUser?.bio || '',
    nativeLanguage: authUser?.nativeLanguage || '',
    learningLanguage: authUser?.learningLanguage || '',
    location: authUser?.location || '',
    profilePic: authUser?.profilePic || ''
  })
  const queryClient = useQueryClient()

  const {
    mutate: onboardingMutation,
    isPending
  } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success('Profile onboarding ssuccessfully')
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
    },
    onError: (error) => {
      console.log(error)
      toast.error(error.response?.data?.message)
    }
  })
  const handleSubmit = (e) => {
    e.preventDefault()
    onboardingMutation(formState)
  }

  const handleRamdomAvatar = () => {
    console.log('dgmkldfmg')
    const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  }
  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
        <div className='card-body p-6 sm:p-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>Completed Your Profile</h1>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Profile pic cpntainer */}
            <div className=' flex flex-col items-center justify-center space-y-4'>
              <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
                {formState ? (
                  <img
                    src={formState.profilePic}
                    alt='Profile preview'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <CameraIcon className=' size-12 text-base-content opacity-40' />
                )}
              </div>
              {/* ramdom avatar button */}
              <div className=' flex items-center  gap-2'>

                <button type='button' onClick={handleRamdomAvatar} className='btn btn-accent'>
                  <ShuffleIcon className=' size-4 mr-1' />
                  Generate Random Avatar
                </button>
              </div>

            </div>

            {/* fullname */}

            <div className='form-control'>
              <label className='lable'>
                <span className='lable-text'>Full Name</span>
              </label>
              <input
                type='text'
                placeholder='John Doe'
                className='input input-bordered w-full'
                value={formState.fullName}
                onChange={(e) => { setFormState({ ...formState, fullName: e.target.value }) }}
                required
              />
            </div>

            {/* Bio */}
            <div className='form-control'>
              <label className='lable'>
                <span className='lable-text'>Bio</span>
              </label>
              <textarea
                type='text'
                placeholder='John Doe'
                className='textarea textarea-bordered w-full h-24'
                value={formState.bio}
                onChange={(e) => { setFormState({ ...formState, bio: e.target.value }) }}
                required
              />
            </div>
            {/* language */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* native language */}
              <div className='form-control'>
                <label className=' lable'>
                  <span className='lable-text'>Native Language</span>
                </label>
                <select
                  name='nativeLanguage'
                  value={formState.nativeLanguage}
                  onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                  className='select select-bordered w-full'
                  required
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                  ))}
                </select>
              </div>
              <div className='form-control'>
                <label className=' lable'>
                  <span className='lable-text'>Learning Language</span>
                </label>
                <select
                  name='nativeLanguage'
                  value={formState.learningLanguage}
                  onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                  className='select select-bordered w-full'
                  required
                >
                  <option value="">Select your learning language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* location */}
            <div className=' form-control'>
              <label className='label'>
                <span className='lable-text'>Location</span>
              </label>
              <div className='relative'>
                <MapPinIcon className=' absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70' />
                <input
                  type='text'
                  name='location'
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className='input input-bordered w-full pl-10'
                  placeholder='City, Country'
                  required
                />
              </div>

            </div>
            {/* submit button */}

            <button type='submit' className='btn btn-primary w-full' disabled={isPending}>
              {!isPending ? (
                <>
                  <ShipWheelIcon className='size-5 mr-2' />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className='animate-spin size-5 mr-2' />
                  Onboarding...
                </>
              )}
            </button>


          </form>
        </div>
      </div>

    </div>
  )
}

export default OnboardingPage