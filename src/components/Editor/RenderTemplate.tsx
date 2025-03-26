import { useEffect, useState } from "react";
import Handlebars from "handlebars";
import Preview from "./Preview";
import useFormStore from "@/stores/useFormStore";

const RenderTemplate = ({ html, fields }: { html: string, fields: any }) => {
    const [renderedHTML, setRenderedHTML] = useState("");
    const values = useFormStore((state) => state.values);
    
    useEffect(() => {
        if (html && fields) {
            const compiledTemplate = Handlebars.compile(html);
            setRenderedHTML(compiledTemplate(values));
        }
        return () => setRenderedHTML("");
    }, [html, values]);

    return <Preview templateHtml={renderedHTML} />
}

export default RenderTemplate;