import { useQuery } from "@tanstack/react-query";
import RenderTemplate from "@/components/Editor/RenderTemplate"
import TemplateSettings from "@/components/Editor/Settings"
import axiosInstance from "@/lib/axiosInstance";

const fetchTemplate = async () => {
    const res = await axiosInstance('/templates/123');
    if (res.status !== 200) throw new Error('Failed to fetch data');
    return res.data;
};

const Editor = () => {
    const { data, error, isLoading } = useQuery({ queryKey: ['template'], queryFn: fetchTemplate });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {(error as Error).message}</div>;

    return (
        <div className="grid grid-cols-2 gap-4 p-4">
            <TemplateSettings fields={data.fields}/>
            <RenderTemplate
                html={data.html}
                fields={{
                    name: 'Emily & Michael',
                    date: 'Saturday, June 15, 2025 at 6:00 PM',
                    location: '123 Celebration Avenue <br> New York, NY 10001'
                }}
            />
        </div>
    )
}


export default Editor