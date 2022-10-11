import axios from "axios";
import { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

function Watermark(){
    const [file, setFile] = useState(null)

    function checkFile(filew){
        console.log(filew)
    }
    function fileHandle(event){
        setFile(event.target.files[0])
    }
    async function requestWatermark(){
        const url = 'http://localhost:3001/test/watermark'
        const config = {
            headers: {
                'Content-Type': 'application/pdf',
            },
            responseType: 'blob'
        }
        const response = await axios.get(url, config)
        const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
        const existingPdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();
        console.log(pdfDoc)
        const watermarkUrl = 'http://localhost:3001/images/watermark_rmuti_logo_2.png'
        const watermarkImageBytes = await fetch(watermarkUrl).then((res) => res.arrayBuffer());
        const watermarkImage = await pdfDoc.embedPng(watermarkImageBytes)
        const imageDims = watermarkImage.scale(0.5)
        for(let index = 0; index < pages.length; index++){
            pages[index].drawImage(watermarkImage, {
                x: pages[index].getWidth() / 2 - imageDims.width / 2,
                y: pages[index].getHeight() / 2 - imageDims.height / 2 + 25,
                width: imageDims.width,
                height: imageDims.height,
                opacity: 0.2
            })
        }
        const pdfBytes = await pdfDoc.save()
        const pdfFinal = await window.URL.createObjectURL(new Blob([pdfBytes]));
        // await window.downlaod(pdfFinal)
        var link = document.createElement('a');
        link.href = pdfFinal;
        link.download = 'file.pdf';
        link.dispatchEvent(new MouseEvent('click'));
    }
    return (
        <section>
            <h1>Test Watermark PDF</h1>
            <input type="file" name="file" id="" onChange={fileHandle}/>
            <button onClick={requestWatermark}>send file</button>
            <button onClick={checkFile}>check file</button>
        </section>
    )
}

export default Watermark;