import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export function useFormValidation<T extends z.ZodSchema>(
  schema: T,
  defaultValues?: z.infer<T>
) {
  return useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onBlur',
  })
}
