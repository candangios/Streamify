import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { logout } from '../lib/api'

function useLogout() {
  const queryClient = useQueryClient()
  const { mutate: logoutMutation, isPending, error } = useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.invalidateQueries(['authUser'])
  })
  return { isPending, error, logoutMutation }
}

export default useLogout