'use server'

import { CardTitle } from '@/components/ui/card'
import InfoBoxDescription from './InfoBoxDescription'
import { formatDate } from '@/lib/utils/time'
import SignUp from '../plugins/SignUp'
import ViewCounts from '@/app/(vod)/watch/components/ViewCounts'

const SessionInfoBox = async ({
  name,
  description,
  inverted,
  playbackId,
  date,
  vod = false,
  viewCount = false,
}: {
  name: string
  description: string
  date: string
  playbackId?: string
  inverted?: boolean
  vod?: boolean
  viewCount?: boolean
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row py-4 md:space-x-2  ${
        inverted ? 'text-white rounded-lg  text-card-foreground ' : ''
      }`}>
      <div className="flex flex-col justify-start w-full">
        <CardTitle className="flex flex-row justify-between items-start text-xl lg:text-2xl">
          <span>{name}</span>
        </CardTitle>
        <InfoBoxDescription description={description} />
        <p className="flex items-center space-x-2 text-sm">
          <span>
            {formatDate(new Date(date), 'ddd. MMMM D, YYYY')}
          </span>
          {playbackId && (
            <>
              <span className="font-bold">|</span>
              <ViewCounts playbackId={playbackId} />
            </>
          )}
        </p>
      </div>
      <div className="flex justify-between items-center mb-auto space-x-2 md:justify-end">
        {/* <SignUp event={name} /> */}
      </div>
    </div>
  )
}

export default SessionInfoBox
