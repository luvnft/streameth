'use client'

import { TableCell } from '@/components/ui/table'
import { IExtendedSession, eLayout } from '@/lib/types'
import {
  ChevronDown,
  Copy,
  EllipsisVertical,
  Earth,
  Lock,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import DefaultThumbnail from '@/lib/svg/DefaultThumbnail'
import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import { formatDate } from '@/lib/utils/time'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { updateSessionAction } from '@/lib/actions/sessions'
import ProcessingSkeleton from './misc/ProcessingSkeleton'
import { PopoverActions } from './misc/PopoverActions'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const TableCells = ({
  item,
  organization,
}: {
  item: IExtendedSession
  organization: string
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(item.ipfsURI!)
    toast.success('Copied IPFS Hash to your clipboard')
  }

  const handlePublishment = () => {
    updateSessionAction({
      session: {
        _id: item._id,
        name: item.name,
        description: item.description,
        organizationId: item.organizationId,
        eventId: item.eventId,
        stageId: item.stageId,
        start: item.start ?? Number(new Date()),
        end: item.end ?? Number(new Date()),
        speakers: item.speakers ?? [],
        type: item.type ?? 'video',
        published: !item.published,
      },
    })
      .then(() => {
        if (item.published === true) {
          toast.success('Succesfully made your asset private')
        } else if (item.published === false) {
          toast.success('Succesfully made your asset public')
        }
      })
      .catch(() => {
        toast.error('Something went wrong...')
      })
  }

  if (!item.videoUrl) {
    return <ProcessingSkeleton item={item} />
  }

  return (
    <>
      <TableCell className="relative font-medium max-w-[500px]">
        <div className="flex flex-row items-center space-x-4 w-full">
          <div className="min-w-[100px]">
            <AspectRatio ratio={16 / 9}>
              {item.coverImage ? (
                <Image
                  src={item.coverImage}
                  style={{ objectFit: 'contain' }}
                  fill
                  alt="Thumbnail Image"
                  quality={40}
                />
              ) : (
                <div className="flex justify-center items-center w-full h-full">
                  <DefaultThumbnail className="max-w-full max-h-full" />
                </div>
              )}
            </AspectRatio>
          </div>

          <Link href={`library/${item._id}`}>
            <span className="hover:underline line-clamp-3">
              {item.name}
            </span>
          </Link>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex justify-start items-center space-x-2">
          {item.published ? (
            <>
              <Earth size={16} />
              <p>Public</p>
            </>
          ) : (
            <>
              <Lock size={16} />
              <p>Private</p>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <ChevronDown size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="space-x-2 cursor-pointer"
                onClick={() => handlePublishment()}>
                {!item.published ? (
                  <>
                    <Earth size={16} />
                    <p>Make Public</p>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <p>Make Private</p>
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
      {item.createdAt && (
        <TableCell className="truncate">
          {formatDate(
            new Date(item.createdAt as string),
            'ddd. MMM. D, YYYY'
          )}
        </TableCell>
      )}
      <TableCell className="relative max-w-[200px]">
        {item.ipfsURI ? (
          <div
            className="flex items-center hover:bg-gray-200 group"
            onClick={handleCopy}>
            <span className="flex-1 m-2 rounded cursor-pointer truncate">
              {item.ipfsURI}
            </span>
            <Copy className="p-1 mr-2 opacity-0 group-hover:opacity-100">
              Copy IPFS Hash
            </Copy>
          </div>
        ) : (
          'No IPFS Url available'
        )}
      </TableCell>
      <TableCell>
        <Popover>
          <PopoverTrigger className="z-10">
            <EllipsisVertical className="mt-2" />
          </PopoverTrigger>
          <PopoverContent className="w-60">
            <PopoverActions
              session={item}
              organizationSlug={organization}
              layout={eLayout.list}
            />
          </PopoverContent>
        </Popover>
      </TableCell>
    </>
  )
}

export default TableCells
