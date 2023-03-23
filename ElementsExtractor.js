function FindAframeElements(text) {
    console.log("Start to fine A-Frame Elements\n"); 
    let generatedElements = [];
    // <a-scene> と </a-scene> タグの間の内容、または全体の内容を抽出する正規表現
    const regex = /```(?:html)?\s*([\s\S]*?)```/g;
    let matchCodeBlock;
    while ((matchCodeBlock = regex.exec(text)) !== null) {
        const codeBlockContent = matchCodeBlock[1];
        console.log("コードブロック内\n" + codeBlockContent);
        const sceneContentRegex = /<a-scene[^>]*>([\s\S]*?)<\/a-scene>/;
        const matchScene = sceneContentRegex.exec(codeBlockContent);
        if (matchScene) {// <a-scene> と </a-scene> タグの間の内容が見つかった場合
            const sceneContent = matchScene[1];
            ProcessSceneContent(sceneContent,generatedElements );
        } else {// <a-scene> と </a-scene> タグが見つからなかったけど<a-*>がある場合。
            const fallbackRegex = /<a-[\w-]+[\s\S]*?(?:\/>|<\/a-[\w-]+>)/g;
            const matches = codeBlockContent.match(fallbackRegex);
            console.log("matches\n" + matches);
            // A-Frame のプリミティブ要素が見つかった場合
            if (matches) {
                const sceneContent = matches.join("\n");
                ProcessSceneContent(sceneContent,generatedElements);
            }
        }   
    }
    return generatedElements;
}

function ProcessSceneContent(sceneContent, generatedElements) {
    console.log("抽出された要素\n" + sceneContent);
    // containerに各要素を追加
    const elements = document.createElement('div');
    elements.innerHTML = sceneContent.trim();
    while (elements.firstChild) {
        if(elements.firstChild.outerHTML){
            generatedElements.push(elements.firstChild);
        }
        elements.removeChild(elements.firstChild);
    }
}