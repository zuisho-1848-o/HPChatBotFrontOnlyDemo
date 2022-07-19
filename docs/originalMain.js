/** Demo特有の main.js のコードをまとめる */

// const appServerOrigin = "http://localhost:5000";

let defaultSleepTime = 500;
const restoreAnswerSleepTime = 300;

let useFullScreen = false;

const questions = [
    {
        qId: "a0",
        qText: "好きな色を一つお選びください。",
        qType: "singleChoice",
        options: [
            {id: "a0", text: "青"},
            {id: "a1", text: "赤"},
            {id: "a2", text: "黄"},
        ]
    },{
        qId: "a1",
        qText: "好きな言葉を一つお選びください。",
        qType: "singleChoice",
        options : [
            {id: "a0", text: "天は人の上に人を造らず天は人の下に人を造らず"},
            {id: "a1", text: "夢なき者に成功なし"},
            {id: "a2", text: "精神的に向上心のない者は馬鹿だ"},
        ]
    },{
        qId: "a2",
        qText: "好きな形をお選び下さい。※複数選択可能",
        qType: "multiChoice",
        options : [
            {id: "a0", text: "三角"},
            {id: "a1", text: "四角"},
            {id: "a2", text: "丸"},
            {id: "a3", text: "星"},
            {id: "a4", text: "この中にはない"},
        ]
    },{
        qId: "a3",
        qText: "何か一言ご入力ください。",
        qType: "textInput",
    },{
        qId: "a4",
        qText: "あなたが好きな色は「【color】」で、好きな言葉は「【word】」で、好きな形は「【好きな形】」ですね。最後に「【最後に】」とご入力いただきありがとうございました。",
        qType: "closing",
    }
];

const replaceIDToQId = {
    "color": "a0",
    "word": "a1",
    "好きな形": "a2",
    "最後に": "a3"
}



const setAnswersAndGetNextQ = async (body) => {
    let nextQ = "";
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
    if(nextQ?.qType === "closing") {
        nextQ.replaceIDToQId = replaceIDToQId;
    }
    console.log(nextQ);
    if(!nextQ) {
        nextQ = {finish: true};
    }

    return new Promise((resolve, reject) => {
        resolve(Object.assign({}, nextQ));
    });
}







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