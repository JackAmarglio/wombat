// спизжено с https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript/52311051#52311051
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            let encoded = reader.result.toString().replace(/^data(.*,)?/, "");
            if (encoded.length % 4 > 0) {
                encoded += "=".repeat(4 - (encoded.length % 4));
            }
            resolve(encoded);
        };
        reader.onerror = (error) => reject(error);
    });
}

// todo: добавить задержку перед тем, как стопить запись (возможно лучше во вью это делать)
// todo: понять, почему только первая запись работает. Сейчас с каждой записью создается новый объект как костыль.
class TeamVoiceRecorder {
    #recorder;
    #audioStream;
    #isRecording = false;
    #recordedChunks = [];
    #lastRecordedBlob = null;

    get isRecording() {
        return this.#isRecording;
    }

    get lastRecordedBlob() {
        return this.#lastRecordedBlob;
    }

    async lastRecordedBlobAsB64() {
        if (this.#lastRecordedBlob === null) return "";

        return await getBase64(this.#lastRecordedBlob);
    }

    async startRecording() {
        if (this.isRecording) {
            console.warn("Already recording.");
            return;
        }

        this.#lastRecordedBlob = null;

        this.#audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });

        this.#recorder = new MediaRecorder(this.#audioStream);
        this.#recorder.ondataavailable = (e) => this.#onDataAvailable(e);
        this.#recorder.start(100);

        this.#isRecording = true;
    }

    async stopRecording() {
        if (this.#isRecording === false) return;

        this.#recorder.stop();
        this.#lastRecordedBlob = new Blob(this.#recordedChunks, { type: "audio/ogg; codecs=opus" });
        console.log(window.URL.createObjectURL(this.#lastRecordedBlob));

        const audioMedia = this.#audioStream.getAudioTracks()[0];
        audioMedia.stop();

        this.#recordedChunks = [];
        this.#isRecording = false;
    }

    #onDataAvailable(e) {
        this.#recordedChunks.push(e.data);
    }

    logState() {
        console.log("#recorder", this.#recorder);
        console.log("#audioStream", this.#audioStream);
        console.log("#isRecording", this.#isRecording);
        console.log("#recordedChinks", this.#recordedChunks);
        console.log("#lastRecordedBlob", this.#lastRecordedBlob);
    }
}

export default TeamVoiceRecorder;
