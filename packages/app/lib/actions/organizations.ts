'use server'
import {
  addOrganizationMember,
  createOrganization,
  deleteTeamMember,
  updateOrganization,
} from '@/lib/services/organizationService'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { IOrganization } from 'streameth-new-server/src/interfaces/organization.interface'
import { redirect } from 'next/navigation'
import { IExtendedOrganization } from '../types'

export const createOrganizationAction = async ({
  organization,
}: {
  organization: IOrganization
}) => {
  const authToken = cookies().get('user-session')?.value
  const walletAddress = cookies().get('user-address')?.value
  if (!authToken || !walletAddress) {
    throw new Error('No user session or wallet address found')
  }
  const response = await createOrganization({
    organization: {
      ...organization,
      walletAddress: walletAddress,
    },
    authToken,
  })

  if (!response) {
    throw new Error('Error creating organization')
  }
  revalidatePath('/studio')
  return response
}

export const updateOrganizationAction = async ({
  organization,
}: {
  organization: IExtendedOrganization
}) => {
  const authToken = cookies().get('user-session')?.value
  const walletAddress = cookies().get('user-address')?.value
  if (!authToken || !walletAddress) {
    throw new Error('No user session or wallet address found')
  }
  const response = await updateOrganization({
    organization: {
      ...organization,
      walletAddress: walletAddress,
    },
    authToken,
  })

  if (!response) {
    throw new Error('Error updating organization')
  }
  revalidatePath('/studio')
  return response
}

export const addOrganizationMemberAction = async ({
  memberWalletAddress,
  organizationId,
}: {
  organizationId: string
  memberWalletAddress: string
}) => {
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session or wallet address found')
  }

  const response = await addOrganizationMember({
    organizationId,
    memberWalletAddress,
    authToken,
  })

  if (!response) {
    throw new Error('Error adding organization member')
  }
  revalidatePath('/studio')
  return response
}

export const deleteTeamMemberAction = async ({
  memberWalletAddress,
  organizationId,
}: {
  memberWalletAddress: string
  organizationId: string
}) => {
  const authToken = cookies().get('user-session')?.value
  if (!authToken) {
    throw new Error('No user session found')
  }

  const response = await deleteTeamMember({
    memberWalletAddress,
    organizationId,
    authToken,
  })
  if (!response) {
    throw new Error('Error deleting team member action')
  }
  revalidatePath('/studio')
  return response
}
