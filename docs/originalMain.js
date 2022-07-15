/** Demo特有の main.js のコードをまとめる */

// const appServerOrigin = "http://localhost:5000";

let defaultSleepTime = 500;
const restoreAnswerSleepTime = 300;

let useFullScreen = false;

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