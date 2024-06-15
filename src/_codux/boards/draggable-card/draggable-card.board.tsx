import { createBoard } from '@wixc3/react-board';
import { DraggableCard } from '../../../components/draggable-card/draggable-card';

function getImgUrl(fileName:string){
    let ext = 'jpg' // can be anything
    const imgUrl = new URL(`../../../assets/card-images/${fileName}.${ext}`, import.meta.url).href
    return imgUrl
}

export default createBoard({
    name: 'DraggableCard',
    Board: () => <DraggableCard imageText="Image" imageSrc={getImgUrl("placeholder")} id="5"/>,
    isSnippet: true,
    environmentProps: {
        windowWidth: 1024,
        canvasHeight: 100,
    },
});
