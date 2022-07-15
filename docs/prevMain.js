/** 1つ前の main を残しておく */

console.log("loaded!!");
// const appServerOrigin = "http://localhost:5000";

const chat = document.getElementsByClassName("chat")[0];
const chatMain = document.getElementsByClassName("chatMain")[0];
const chatStart = document.getElementsByClassName("chatStart")[0];


// chat を開いたときに送信する message
const firstMessages = ["こんにちは！", "Chat へようこそ！", "ぜひ以下の質問にお答えください！！", "長い文のテスト長い文のテスト長い文のテスト長い文のテスト長い文のテスト長い文のテスト長い文のテスト"]


const questions = [
    {
        qId: "a0",
        qText: "好きな色は？",
        qType: "textInput",
    },
    {
        qId: "a1",
        qText: "好きな言葉は？",
        qType: "singleChoice",
        options : [
            {id: "a0", text: "天は人の上に人を造らず天は人の下に人を造らず"},
            {id: "a1", text: "夢なき者に成功なし"},
            {id: "a2", text: "精神的に向上心のない者は馬鹿だ"},
        ]
    },
    {
        qId: "a2",
        qText: "好きな形は？",
        qType: "multiChoice",
        options : [
            {id: "a0", text: "三角"},
            {id: "a1", text: "四角"},
            {id: "a2", text: "丸"},
        ]
    }
];

/**
 * 指定したミリ秒、非同期で待機する。
 * @param {number} milliSeconds - 何ミリ秒待つか
 * @returns {Promise<null>}
 */
const sleep = (milliSeconds) => new Promise(resolve => setTimeout(resolve, milliSeconds));
let defaultSleepTime = 500;



/**
 * Chat にbot からの textChat を代入する
 * @param {Element} element - bot からの textChat を代入する HTML 要素
 * @param {string} text - textChat の text
 */
const insertTextChatFromBot = async (element, text) => {
    await sleep(defaultSleepTime);
    element.insertAdjacentHTML("beforeend", `<div class='chatMesssageBlock chatFromBot'>${text}</div>`);
    element.scrollTop = element.scrollHeight;
}



/**
 * 
 * 単一選択のdiv要素を作る
 * @param {Element} element - 単一選択 を代入する HTML 要素 
 * @param {Array<TextChoiceOption>} options - 選択肢の配列。
 * @param {string} qId - 質問のid。単一選択全体に共通する name 属性やその内部要素の id に使う。
 * @param {string} qType - 質問の形式。id や name 要素に使う。
 * @returns 
 */
const insertSingleChoiceBlock = async (element, options, qId, qType) => {
    let insertHTML = `<div class="chatMesssageBlock choiceBlock">\n`;

    for(let option of options){
        insertHTML += 
`<div>
    <input id="${qType + "-" + qId + "-" + option.id}" name="${qType + "-" + qId}" class="singleChoiceOptionRadio" type="radio">
    <label for="${qType + "-" + qId + "-" + option.id}" class="singleChoiceOptionLabel">${option.text}</label>
</div>\n`;
    }

    insertHTML += `</div>`;
    await sleep(defaultSleepTime);
    element.insertAdjacentHTML("beforeend", insertHTML);
    element.scrollTop = element.scrollHeight;
}


/**
 * 
 * 複数選択のdiv要素を作る
 * @param {Element} element - 複数選択 を代入する HTML 要素 
 * @param {Array<TextChoiceOption>} options - 選択肢の配列。
 * @param {string} qId - 質問のid。複数選択全体に共通する name 属性やその内部要素の id に使う。
 * @param {string} qType - 質問の形式。id や name 要素に使う。
 * @returns 
 */
const insertMultiChoiceBlock = async (element, options, qId, qType) => {
    let insertHTML = `<div class="chatMesssageBlock choiceBlock">\n`;

    for(let option of options){
        insertHTML += 
`<div>
    <input id="${qType + "-" + qId + "-" + option.id}" name="${qType + "-" + qId}" value="${option.text}" class="multiChoiceOptionCheckbox" type="checkbox">
    <label for="${qType + "-" + qId + "-" + option.id}" class="multiChoiceOptionLabel">${option.text}</label>
</div>\n`;
    }

    insertHTML += `<input id="${qType + "-" + qId + "-submit"}" class="answerSubmitButton" type="button" value="回答" >\n`

    insertHTML += `</div>`;
    await sleep(defaultSleepTime);
    element.insertAdjacentHTML("beforeend", insertHTML);
    element.scrollTop = element.scrollHeight;
}



const insertTextInputBlock = async (element, qId, qType) => {
    let insertHTML = 
`<div class="chatMesssageBlock choiceBlock">
    <input id="${qType + "-" + qId}" placeholder="テキストで回答を入力" class="answerTextInputArea" type="text" maxlength="256">
    <input id="${qType + "-" + qId + "-submit"}" class="answerSubmitButton" type="button" value="回答" >
</div>`;

    await sleep(defaultSleepTime);
    element.insertAdjacentHTML("beforeend", insertHTML);
    element.scrollTop = element.scrollHeight;
}


/**
 * 
 * @param {Element} chatMainElement - 処理において新たに chat を追加する element
 * @param {Question} question - 質問データ
 */
const insertQ = async (chatMainElement, question) => {
    await insertTextChatFromBot(chatMainElement, question.qText);
    switch(question.qType) {
        case "singleChoice": 
            insertSingleChoiceBlock(chatMainElement, question.options, question.qId, question.qType);
            break;
        case "multiChoice": 
            insertMultiChoiceBlock(chatMainElement, question.options, question.qId, question.qType);
            break;
        case "textInput": 
            insertTextInputBlock(chatMainElement, question.qId, question.qType);
            break;
    }
}


// /**
//  * 
//  * @param {AnswerData | null} answerData - 前の質問に対する回答。最初は null を送る。
//  * @returns 次の質問のデータ。
//  */
// const setAnswersAndGetNextQ = async (answerData) => {
//     // console.log("just before fetch");
//     const res = await fetch(appServerOrigin, {
//         method: "POST",
//         mode: "cors",
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(answerData)
//     })
//     // console.log(res);
//     const resJson = await res.json();
//     // console.log(resJson);
//     return resJson;
// }

const setAnswersAndGetNextQ = async (body) => {
    if(body?.isFirst) {
        console.log("最初の質問です。");
        nextQ = questions?.[0];
    } else {
        /**
         * @type {AnswerData}
         */
        const answerData = body?.answerData;
        console.log("答えはこれでした。");
        console.log(answerData);

        nextQIndex = questions.findIndex((question) => answerData?.question?.qId === question?.qId) + 1;
        // console.log(nextQIndex);
        nextQ = questions?.[nextQIndex]
    }

    console.log("送る質問はこれです。")
    console.log(nextQ);
    if(!nextQ) {
        nextQ = {finish: true};
    }

    return new Promise((resolve, reject) => {
        resolve(nextQ)
    });
}


/**
 * 単一選択のlabelがクリックされたときの処理を書く
 * @param {Element} chatMainElement - 処理において新たに chat を追加する element
 * @param {Element} target - クリックされた label
 */
const handleSingleChoiceOptionLabelClick = async (chatMainElement, target) => {
    // console.log(target);
    const optionText = target.innerText;
    const optionFullID = target.getAttribute("for"); // {qType + "-" + qId + "-" + option.id}

    const [qType, qId, optionId] = optionFullID.split("-");

    // console.log(optionText);
    // console.log(optionFullID);
    await insertTextChatFromBot(chatMainElement, `"${optionText}" が選択されました。`);

    /**
     * @type {AnswerData}
     */
    const answerData = {
        question: {qType, qId},
        answers: [{id: optionId, text: optionText}]
    }

    // console.log("answerData:");
    // console.log(answerData);

    const nextQ = await setAnswersAndGetNextQ({answerData});
    
    // console.log(nextQ);
    if(nextQ.finish) {
        await insertTextChatFromBot(chatMain, "質問はすべて終わりです。");
    } else {
        await insertQ(chatMain, nextQ);
    }
}



/**
 * 複数選択のlabelがクリックされたときの処理を書く
 * @param {Element} chatMainElement - 処理において新たに chat を追加する element
 * @param {Element} target - クリックされた label
 */
const handleMultiChoiceSubmit = async (chatMainElement, target) => {
    const qFullId = target.id;
    const [qType, qId] = qFullId.split("-");
    // console.log(qFullId);
    // console.log(qType);
    // console.log(qId);

    let answers = "";
    let answersText = "";
    switch(qType) {
        case "multiChoice": 
            answers = [...document.getElementsByName(`${qType}-${qId}`)]
                .filter(elem => elem.checked)
                .map(elem => {
                    return {id: elem.id.split("-")[2], text: elem.value}
                });
            answersText = answers.map(answer => answer.text).join(",");
            break;
        case "textInput": 
            answers = document.getElementById(`${qType}-${qId}`).value;
            answersText = answers;
            break;
        }
    // console.log(answersText);

    
    await insertTextChatFromBot(chatMainElement, `"${answersText}" が選択されました。`);

    const answerData = {
        question: {qType, qId},
        answers
    }

    // console.log("answerData:");
    // console.log(answerData);

    const nextQ = await setAnswersAndGetNextQ({answerData});
    
    // console.log(nextQ);
    if(nextQ.finish) {
        await insertTextChatFromBot(chatMain, "質問はすべて終わりです。");
    } else {
        await insertQ(chatMain, nextQ);
    }
    
}



// 増加する可能性のある要素に対する click event をまとめて受け取る
document.addEventListener('click', function(e) {
    // 単一選択のlabelに対するクリックイベントを設定
    if (e?.target?.classList?.contains("singleChoiceOptionLabel")) {
        handleSingleChoiceOptionLabelClick(chatMain, e.target);
    } else if(e?.target?.classList?.contains("chatStart") || e?.target?.classList?.contains("closeButton")) {
        chatStart.classList?.toggle("display-none");
        chat?.classList?.toggle("display-none");
    } else if(e?.target?.classList?.contains("answerSubmitButton")) {
        handleMultiChoiceSubmit(chatMain, e.target);
    }
});




chatStart.addEventListener("click", async () => {
    if(chatMain.innerHTML == "") {
        for(let message of firstMessages){
            await insertTextChatFromBot(chatMain, message);
        }
        
        // console.log("will get firstQ");
        const firstQ = await setAnswersAndGetNextQ({"isFirst": true});
        await insertQ(chatMain, firstQ);
    }
})


document.getElementById("textSpeedInput").addEventListener("change", (e) => {
    defaultSleepTime = e.target.value;
})


document.getElementById("fontSizeInput").addEventListener("change", (e) => {
    document.querySelectorAll(".chat, .chat *").forEach((elem) => {
        elem.style.fontSize = e.target.value + "px";
    })
})

