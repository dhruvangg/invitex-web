"use client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import useFormStore from "@/stores/useFormStore"

// Define the field types
type FieldOption = {
  label: string
  value: string
}

type FieldDefinition = {
  name: string
  type: "text" | "date" | "datetime" | "select" | "textarea" | "number" | "email"
  label: string
  description?: string
  required?: boolean
  options?: FieldOption[]
  placeholder?: string
}

type JsonFormGeneratorProps = {
  fields: FieldDefinition[]
  onSubmit: (values: any) => void
}

export function JsonFormGenerator({ fields, onSubmit }: JsonFormGeneratorProps) {
  const { updateValue } = useFormStore();
  // Dynamically create a Zod schema based on the field definitions
  const generateZodSchema = (fields: FieldDefinition[]) => {
    const schema: Record<string, any> = {}

    fields.forEach((field) => {
      let fieldSchema: any

      // Create the appropriate schema based on field type
      switch (field.type) {
        case "text":
          fieldSchema = z.string()
          break
        case "email":
          fieldSchema = z.string().email()
          break
        case "number":
          fieldSchema = z.coerce.number()
          break
        case "date":
        case "datetime":
          fieldSchema = z.date()
          break
        case "select":
          fieldSchema = z.string()
          break
        case "textarea":
          fieldSchema = z.string()
          break
        default:
          fieldSchema = z.string()
      }

      // Add required validation if needed
      if (field.required) {
        if (field.type === "text" || field.type === "email" || field.type === "textarea") {
          fieldSchema = fieldSchema.min(1, { message: `${field.label} is required` })
        } else {
          fieldSchema = fieldSchema.refine((val: string) => val !== undefined, {
            message: `${field.label} is required`,
          })
        }
      } else {
        // Make the field optional if not required
        fieldSchema = fieldSchema.optional()
      }

      schema[field.name] = fieldSchema
    })

    return z.object(schema)
  }

  const formSchema = generateZodSchema(fields)

  // Create form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: fields.reduce(
      (acc, field) => {
        if (field.type === "date" || field.type === "datetime") {
          acc[field.name] = undefined
        } else {
          acc[field.name] = ""
        }
        return acc
      },
      {} as Record<string, any>,
    ),
  })

  // Handle form submission
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values)
  }

  // Render the appropriate form field based on field type
  const renderField = (field: FieldDefinition) => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                    {...formField}
                    type={field.type}
                    onChange={(e) => {
                      formField.onChange(e);
                      updateValue(field.name, e.target.value);
                    }}
                  />
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "textarea":
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                    {...formField}
                    onChange={(e) => {
                      formField.onChange(e);
                      updateValue(field.name, e.target.value);
                    }}
                  />
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "date":
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{field.label}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn("w-full pl-3 text-left font-normal", !formField.value && "text-muted-foreground")}
                      >
                        {formField.value ? format(formField.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={formField.value} onSelect={(date) => {
                      formField.onChange(date);
                      updateValue(field.name, date);
                    }} initialFocus />
                  </PopoverContent>
                </Popover>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "datetime":
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{field.label}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn("w-full pl-3 text-left font-normal", !formField.value && "text-muted-foreground")}
                      >
                        {formField.value ? format(formField.value, "PPP HH:mm") : <span>Pick date and time</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-2">
                      <Calendar mode="single" selected={formField.value} onSelect={(date) => {
                          formField.onChange(date);
                          updateValue(field.name, date);
                        }} initialFocus />
                      {formField.value && (
                        <div className="px-4 pt-4 pb-2">
                          <Input
                            type="time"
                            onChange={(e) => {
                              const date = new Date(formField.value)
                              const [hours, minutes] = e.target.value.split(":")
                              date.setHours(Number.parseInt(hours, 10))
                              date.setMinutes(Number.parseInt(minutes, 10))
                              formField.onChange(date)
                              updateValue(field.name, date);
                            }}
                            value={
                              formField.value
                                ? `${String(formField.value.getHours()).padStart(2, "0")}:${String(formField.value.getMinutes()).padStart(2, "0")}`
                                : ""
                            }
                          />
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "select":
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      default:
        return null
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {fields.map(renderField)}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
