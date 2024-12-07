import { ReactElement } from 'react'
import { Tooltip as TooltipComponent } from '@mui/material'

type Props = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: ReactElement<unknown, any>
    title: string
    offset: number
}

export default function Tooltip({ children, title, offset }: Props) {
  return (
    <TooltipComponent
      placement="bottom-end"
      enterDelay={700}
      leaveDelay={0}
      PopperProps={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [offset, 0]
            }
          }
        ]
      }}
      title={title}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: '#fff',
            fontSize: '14px',
            color: '#2196F3',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }
        }
      }}
    >
        {children}
    </TooltipComponent>
  )
}
