import { useEffect, useCallback, useState } from 'react';
import './App.css'
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';

export default function TextEditor() {
    const [socket, setSocket] = useState(null);
    const [quill, setQuill] = useState(null);

    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null || quill != null) return;

        wrapper.innerHTML = "";
        const editor = document.createElement('div');
        wrapper.append(editor);
        const q = new Quill(editor, { theme: "snow" });
        setQuill(q);
    }, []);

    useEffect(() => {
        const s = io('https://3812f59f-52bc-4fde-aab8-d621139cbd61-00-1tt79ukx12y4n.worf.replit.dev/');
        setSocket(s)
        return () => {
            s.disconnect();
        };
    }, []);

    useEffect(()=>{

        if (socket==null || quill==null) return 
        let handler=(delta,oldDelta,source)=>{

            if (source!=='user') return 

            socket.emit('send-change',delta)
            
        }
        quill.on('text-change',handler)

        return ()=>{
            quill.off('text-change',handler)
        }
    },[quill,socket])


    useEffect(()=>{

        if (socket==null || quill==null) return 
        let handler=delta=>{
            quill.updateContents(delta)
        }

        socket.on('get-change',handler)


        return ()=>{
            socket.off('get-change',handler)
        }
    },[quill,socket])

    

    return <div className='container' ref={wrapperRef}></div>;
}
