console.log("loaded!!");


// サイトごとに異なる可能性のある設定集
const appServerOrigin = "http://localhost:5000";
const firstMessages = ["こんにちは！", "Chat へようこそ！", "ぜひ以下の質問にお答えください！！", "長い文のテスト長い文のテスト長い文のテスト長い文のテスト長い文のテスト長い文のテスト長い文のテスト"];
const finishMessage = "質問はすべて終わりです。";
const chosenMessage = (optionText) => `あなたの回答：「${optionText}」`;
let defaultSleepTime = 500;
const restoreAnswerSleepTime = 300;
const toBeFullScreenWidth = 520 // これよりwidthが小さかったらchat start時にfullscreenにする。
let useFullScreen = false;


const chat = document.getElementsByClassName("chat")[0];
const chatMain = document.getElementsByClassName("chatMain")[0];
const chatStart = document.getElementsByClassName("chatStart")[0];

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

// let allChatAnswerData = [];

/**
 * 指定したミリ秒、非同期で待機する。
 * @param {number} milliSeconds - 何ミリ秒待つか
 * @returns {Promise<null>}
 */
const sleep = (milliSeconds) => new Promise(resolve => setTimeout(resolve, milliSeconds));



/**
 * Chat にbot からの textChat を代入する
 * @param {Element} element - bot からの textChat を代入する HTML 要素
 * @param {string} text - textChat の text
 */
const insertTextChatFromBot = async (element, text, sleepTime=defaultSleepTime, id=undefined) => {
    await sleep(sleepTime);
    let insertHTML = `<div class='chatMesssageBlock chatFromBot'`
    if(id) {
        insertHTML += ` id="${id}"`
    }
    insertHTML += `'>${text}</div>`
    element.insertAdjacentHTML("beforeend", insertHTML);
    element.scrollTop = element.scrollHeight;
}



/**
 * 
 * 単一選択のdiv要素を作る
 * @param {Element} element - 単一選択 を代入する HTML 要素 
 * @param {Array<TextChoiceOption>} options - 選択肢の配列。
 * @param {string} qId - 質問のid。単一選択全体に共通する name 属性やその内部要素の id に使う。
 * @param {string} qType - 質問の形式。id や name 要素に使う。
 * @param {Array<TextChoiceOption>} answers - 過去の回答を元にcheckedを再現する時の過去の回答。
 * @returns 
 */
const insertSingleChoiceBlock = async (element, options, qId, qType, answers) => {
    let insertHTML = `<div class="chatMesssageBlock choiceBlock">\n`;
    let answeredIDList = [];
    if(answers) {
        for(let answer of answers) {
            answeredIDList.push(answer.id);
        }
    }

    for(let option of options){
        let checked = "";
        if(answeredIDList.includes(option.id)) checked = "checked";
        insertHTML += 
`<div>
    <input id="${qType + "-" + qId + "-" + option.id}" name="${qType + "-" + qId}" value="${option.text}" class="singleChoiceOptionRadio" type="radio" ${checked}>
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
 * @param {Array<TextChoiceOption>} answers - 過去の回答を元にcheckedを再現する時の過去の回答。
 * @returns 
 */
const insertMultiChoiceBlock = async (element, options, qId, qType, answers) => {
    let insertHTML = `<div class="chatMesssageBlock choiceBlock">\n`;
    let answeredIDList = [];
    if(answers) {
        for(let answer of answers) {
            answeredIDList.push(answer.id);
        }
    }

    for(let option of options){
        let checked = "";
        if(answeredIDList.includes(option.id)) checked = "checked";
        insertHTML += 
`<div>
    <input id="${qType + "-" + qId + "-" + option.id}" name="${qType + "-" + qId}" value="${option.text}" class="multiChoiceOptionCheckbox" type="checkbox" ${checked}>
    <label for="${qType + "-" + qId + "-" + option.id}" class="multiChoiceOptionLabel">${option.text}</label>
</div>\n`;
    }

    insertHTML += `<input id="${qType + "-" + qId + "-submit"}" class="answerSubmitButton" type="button" value="回答" >\n`

    insertHTML += `</div>`;
    await sleep(defaultSleepTime);
    element.insertAdjacentHTML("beforeend", insertHTML);
    element.scrollTop = element.scrollHeight;
}



const insertTextInputBlock = async (element, qId, qType, value) => {
    if(!value) value = "";
    let insertHTML = 
`<div class="chatMesssageBlock choiceBlock">
    <input id="${qType + "-" + qId}" placeholder="テキストで回答を入力" class="answerTextInputArea" value="${value}" type="text" maxlength="256">
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
const insertQ = async (chatMainElement, question, sleepTime=defaultSleepTime, answers) => {
    await insertTextChatFromBot(chatMainElement, question.qText, sleepTime, question.qId+"-qText");
    switch(question.qType) {
        case "singleChoice": 
            insertSingleChoiceBlock(chatMainElement, question.options, question.qId, question.qType, answers);
            break;
        case "multiChoice": 
            insertMultiChoiceBlock(chatMainElement, question.options, question.qId, question.qType, answers);
            break;
        case "textInput": 
            insertTextInputBlock(chatMainElement, question.qId, question.qType, answers);
            break;
    }
}


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
 * 
 * @param {Promise<GetQuestionResult>} fetchPromise 
 * @returns {[GetQuestionResult, number]} 次の質問データとsleepする時間
 */
const resolveGetQAndCalcSleepTime = async (fetchPromise) => {
    const startTime = new Date();
    const nextQ = await Promise.resolve(fetchPromise);
    const fetchTime = new Date() - startTime;
    let sleepTime = defaultSleepTime - fetchTime;
    if(sleepTime < 0) sleepTime = 0;
    console.log("fetchTime:" + fetchTime);
    console.log("sleepTime:" + sleepTime);
    return [nextQ, sleepTime];
}



/**
 * 回答をサーバーに送信し、それに応じて次の質問を決めsetする。
 * @param {AnswerData} answerData - 回答の結果
 * @param {boolean?} doNotSave - localStorage に回答を保存するか。localstorageからの再取得の時などは既に記録してるため記録しない
 */
const setNextQ = async (answerData, doNotSave) => {
    const [nextQ, sleepTime] = await resolveGetQAndCalcSleepTime(setAnswersAndGetNextQ({answerData}));

    // console.log(nextQ);
    if(nextQ.finish) {
        await insertTextChatFromBot(chatMain, finishMessage, sleepTime);
    } else {
        await insertQ(chatMain, nextQ, sleepTime);
    }

    if(doNotSave) return;

    let allChatAnswerData =  [];
    if(localStorage["allChatAnswerData"]) {
        allChatAnswerData = JSON.parse(localStorage["allChatAnswerData"]);
    }
    allChatAnswerData.push(answerData)
    console.log("全回答データ");
    console.log(allChatAnswerData);
    localStorage["allChatAnswerData"] = JSON.stringify(allChatAnswerData);
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
    const qText = document.getElementById(qId + "-qText").innerText;

    let options = [...document.getElementsByName(`${qType}-${qId}`)].map(elem => {
        return {id: elem.id.split("-")[2], text: elem.value}
    });;
    // console.log(optionText);
    // console.log(optionFullID);
    await insertTextChatFromBot(chatMainElement, chosenMessage(optionText));

    /**
     * @type {AnswerData}
     */
    const answerData = {
        question: {qType, qId, qText, options},
        answers: [{id: optionId, text: optionText}]
    }

    // console.log("answerData:");
    // console.log(answerData);

    await setNextQ(answerData)
}



/**
 * 複数選択やテキスト入力の回答ボタンがクリックされたときの処理を書く
 * @param {Element} chatMainElement - 処理において新たに chat を追加する element
 * @param {Element} target - クリックされた label
 */
const handleAnswerSubmit = async (chatMainElement, target) => {
    const qFullId = target.id;
    const [qType, qId] = qFullId.split("-");
    const qText = document.getElementById(qId + "-qText").innerText;
    // console.log(qFullId);
    // console.log(qType);
    // console.log(qId);

    let answers = "";
    let answersText = "";
    let options;
    switch(qType) {
        case "multiChoice": 
            let optionElements = [...document.getElementsByName(`${qType}-${qId}`)];
            answers = optionElements.filter(elem => elem.checked)
                .map(elem => {
                    return {id: elem.id.split("-")[2], text: elem.value}
                });
            answersText = answers.map(answer => answer.text).join(",");

            options = optionElements.map(elem => {
                return {id: elem.id.split("-")[2], text: elem.value}
            });
            break;
        case "textInput": 
            answers = document.getElementById(`${qType}-${qId}`).value;
            answersText = answers;
            break;
        }
    // console.log(answersText);

    
    await insertTextChatFromBot(chatMainElement, chosenMessage(answersText));

    const answerData = {
        question: {qType, qId, qText, options},
        answers
    }

    // console.log("answerData:");
    // console.log(answerData);

    await setNextQ(answerData);
    
}



// 増加する可能性のある要素に対する click event をまとめて受け取る
document.addEventListener('click', function(e) {
    // 単一選択のlabelに対するクリックイベントを設定
    if (e?.target?.classList?.contains("singleChoiceOptionLabel")) {
        handleSingleChoiceOptionLabelClick(chatMain, e.target);
    } else if(e?.target?.classList?.contains("chatStart") || e?.target?.classList?.contains("closeButton")) {
        chatStart.classList?.toggle("display-none");
        chat?.classList?.toggle("display-none");

        if(e?.target?.classList?.contains("closeButton") && document.exitFullscreen) document.exitFullscreen();
    } else if(e?.target?.classList?.contains("answerSubmitButton")) {
        handleAnswerSubmit(chatMain, e.target);
    }
});



chatStart.addEventListener("click", async () => {
    const getFirstQResult = setAnswersAndGetNextQ({"isFirst": true});
    if(useFullScreen && innerWidth < toBeFullScreenWidth) chat.requestFullscreen();

    if(chatMain.innerHTML == "") {
        for(let message of firstMessages){
            await insertTextChatFromBot(chatMain, message);
        }

        if(localStorage["allChatAnswerData"] && confirm("前回このブラウザでchatに回答したデータを利用しますか？")) {
            
            // 過去の回答を利用する場合はlocalstorageを利用して状況を再現する。
            /**
             * @type {Array<AnswerData>}
             */
            let allChatAnswerData = JSON.parse(localStorage["allChatAnswerData"]);
            console.log(allChatAnswerData[allChatAnswerData.length-1]);
            const getNextQResult = setAnswersAndGetNextQ({answerData: allChatAnswerData[allChatAnswerData.length-1]});

            for(let chatAnswerData of allChatAnswerData) {
                // console.log(chatAnswerData);
                // console.log(chatAnswerData.question.qText);
                let answers = chatAnswerData.answers;
                let question = chatAnswerData.question

                await insertQ(chatMain, question, restoreAnswerSleepTime, answers);
                let answersText = "";
                if(typeof answers === "string") {
                    answersText = answers;
                } else {
                    answersText = answers.map(answer => answer.text).join(",");
                }

                await insertTextChatFromBot(chatMain, chosenMessage(answersText));

            }

            let [nextQ, sleepTime] = await resolveGetQAndCalcSleepTime(getNextQResult);
            if(nextQ.finish) {
                await insertTextChatFromBot(chatMain, finishMessage, sleepTime);
            } else {
                await insertQ(chatMain, nextQ, sleepTime);
            }
        } else {
            localStorage.removeItem("allChatAnswerData");
            let [firstQ, sleepTime] = await resolveGetQAndCalcSleepTime(getFirstQResult);
            await insertQ(chatMain, firstQ, sleepTime);
        }
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


document.getElementById("fulScreenCheckBox").addEventListener("change", (e) => {
    useFullScreen = !useFullScreen;
})
