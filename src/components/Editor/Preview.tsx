import { useEffect, useRef } from "react";

// const Preview = ({ templateHtml }: { templateHtml: string }) => {
//     return (
//         <iframe
//             srcDoc={templateHtml}
//             style={{ width: "100%", height: "500px", border: "none" }}
//         />
//     )
// }

const Preview = ({ templateHtml }: { templateHtml: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current && !containerRef.current.shadowRoot) {
            const shadowRoot = containerRef.current.attachShadow({ mode: "open" });
            shadowRoot.innerHTML = templateHtml;
        } else if (containerRef.current && containerRef.current.shadowRoot) {
            containerRef.current.shadowRoot.innerHTML = templateHtml;
        }
    }, [templateHtml]);

    return <div ref={containerRef} />;
};

export default Preview

