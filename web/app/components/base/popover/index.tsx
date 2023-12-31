import { Popover, Transition } from '@headlessui/react'
import { Fragment, cloneElement, useRef } from 'react'
import s from './style.module.css'

export type HtmlContentProps = {
  onClose?: () => void
  onClick?: () => void
}

type IPopover = {
  className?: string
  htmlContent: React.ReactElement<HtmlContentProps>
  trigger?: 'click' | 'hover'
  position?: 'bottom' | 'br'
  btnElement?: string | React.ReactNode
  btnClassName?: string | ((open: boolean) => string)
  manualClose?: boolean
}

const timeoutDuration = 100

export default function CustomPopover({
  trigger = 'hover',
  position = 'bottom',
  htmlContent,
  btnElement,
  className,
  btnClassName,
  manualClose,
}: IPopover) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const timeOutRef = useRef<NodeJS.Timeout | null>(null)

  const onMouseEnter = (isOpen: boolean) => {
    timeOutRef.current && clearTimeout(timeOutRef.current)
    !isOpen && buttonRef.current?.click()
  }

  const onMouseLeave = (isOpen: boolean) => {
    timeOutRef.current = setTimeout(() => {
      isOpen && buttonRef.current?.click()
    }, timeoutDuration)
  }

  return (
    <Popover className="relative">
      {({ open }: { open: boolean }) => {
        return (
          <>
            <div
              {...(trigger !== 'hover'
                ? {}
                : {
                  onMouseLeave: () => onMouseLeave(open),
                  onMouseEnter: () => onMouseEnter(open),
                })}
            >
              <Popover.Button
                ref={buttonRef}
                className={`group ${s.popupBtn} ${open ? '' : 'bg-gray-100'} ${
                  !btnClassName
                    ? ''
                    : typeof btnClassName === 'string'
                      ? btnClassName
                      : btnClassName?.(open)
                }`}
              >
                {btnElement}
              </Popover.Button>
              <Transition as={Fragment}>
                <Popover.Panel
                  className={`${s.popupPanel} ${position === 'br' ? 'right-0' : 'translate-x-1/2 left-1/2'} ${className}`}
                  {...(trigger !== 'hover'
                    ? {}
                    : {
                      onMouseLeave: () => onMouseLeave(open),
                      onMouseEnter: () => onMouseEnter(open),
                    })
                  }
                >
                  {({ close }) => (
                    <div
                      className={s.panelContainer}
                      {...(trigger !== 'hover'
                        ? {}
                        : {
                          onMouseLeave: () => onMouseLeave(open),
                          onMouseEnter: () => onMouseEnter(open),
                        })
                      }
                    >
                      {cloneElement(htmlContent as React.ReactElement<HtmlContentProps>, {
                        onClose: () => onMouseLeave(open),
                        ...(manualClose
                          ? {
                            onClick: close,
                          }
                          : {}),
                      })}
                    </div>
                  )}
                </Popover.Panel>
              </Transition>
            </div>
          </>
        )
      }}
    </Popover>
  )
}
