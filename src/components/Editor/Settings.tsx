import useFormStore from '@/stores/useFormStore';
import { JsonFormGenerator } from '../json-form-generator';

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

const Settings = ({ fields }: { fields: FieldDefinition[] }) => {
  const setValues = useFormStore((state) => state.setValues);
  
  const handleSubmit = (values: any) => setValues(values);
  
  return (
    <JsonFormGenerator fields={fields} onSubmit={handleSubmit} />
  );
};

export default Settings;