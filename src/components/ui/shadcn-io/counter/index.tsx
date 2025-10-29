'use client'

import * as React from 'react'
import { motion, type HTMLMotionProps, type Transition } from 'motion/react'
import { Button } from '../../button'
import { SlidingNumber, SlidingNumberProps } from '../sliding-number'
import { cn } from '@/lib/utils'
/* eslint-disable */
type CounterProps = HTMLMotionProps<'div'> & {
  number: number
  setNumber: (number: number) => void
  slidingNumberProps?: Omit<SlidingNumberProps, 'number'>
  buttonProps?: Omit<React.ComponentProps<typeof Button>, 'onClick'>
  transition?: Transition
  styles?: string
}

function Counter({
  styles,
  number,
  setNumber,
  className,
  slidingNumberProps,
  buttonProps,
  transition = { type: 'spring', bounce: 0, stiffness: 300, damping: 30 },
  ...props
}: CounterProps) {
  const handleDecrement = () => {
    if (number > 1) setNumber(number - 1)
  }

  const handleIncrement = () => {
    setNumber(number + 1)
  }

  return (
    <motion.div
      data-slot="counter"
      layout
      transition={transition}
      className={cn(
        'flex items-center gap-x-2 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800',
        className
      )}
      {...props}
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="icon"
          {...buttonProps}
          onClick={handleDecrement}
          className={cn(
            'bg-white cursor-pointer dark:bg-neutral-950 hover:bg-white/70 dark:hover:bg-neutral-950/70 text-neutral-950 dark:text-white text-2xl font-light pb-[3px]',
            buttonProps?.className
          )}
        >
          -
        </Button>
      </motion.div>

      <SlidingNumber
        number={number}
        {...slidingNumberProps}
        className={cn('text-xs', slidingNumberProps?.className)}
      />

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="icon"
          {...buttonProps}
          onClick={handleIncrement}
          className={cn(
            'bg-white cursor-pointer dark:bg-neutral-950 hover:bg-white/70 dark:hover:bg-neutral-950/70 text-neutral-950 dark:text-white text-2xl font-light pb-[3px]',
            buttonProps?.className
          )}
        >
          +
        </Button>
      </motion.div>
    </motion.div>
  )
  /* eslint-enable */
}

export { Counter, type CounterProps }
