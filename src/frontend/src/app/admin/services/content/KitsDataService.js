import { QUESTIONS_KITS_URL } from "@/app/shared/apiUrls";
import QuestionsDataService from "@/app/admin/services/content/QuestionsDataService";
import {
    GeneralKitQuestionsAmount,
    ReserveKitQuestionsAmount,
} from "@/app/admin/models/content/shared/KitQuestionsAmount";
import { HumbleKitQuestionsShortcutOptions } from "@/app/admin/models/content/shared/HumbleKitQuestionsShortcutOptions";
import HttpClient from "@/app/admin/services/adminHttpClient";

class KitsDataService {
    getQuestionsKits({ offset, limit, filter }) {
        return HttpClient.get(QUESTIONS_KITS_URL, { offset, limit, filter });
    }

    getQuestionsKit(kitId) {
        return HttpClient.get(QUESTIONS_KITS_URL, { id: kitId }, { idInUrl: true });
    }

    createQuestionsKit(kitShortcutModel) {
        return HttpClient.post(QUESTIONS_KITS_URL, kitShortcutModel);
    }

    updateQuestionsKit(kitShortcutModel) {
        return HttpClient.put(QUESTIONS_KITS_URL, kitShortcutModel);
    }

    deleteQuestionsKit(questionsKitId) {
        return HttpClient.delete(QUESTIONS_KITS_URL, questionsKitId);
    }

    prepareKitStateModel(data) {
        return {
            id: data.id,
            name: data.name,
            isReserve: data.isReserve,
            questions: data.questions ? QuestionsDataService.prepareQuestionListForState(data.questions) : [],
        };
    }

    prepareHumbleKitStateModel(data, alreadyHumble, questionsShortcutOptions) {
        return {
            id: data.id,
            name: data.name,
            isReserve: data.isReserve,
            questionsAmount: this.getQuestionsAmountType(data, alreadyHumble, questionsShortcutOptions),
        };
    }

    getQuestionsAmountType(data, alreadyHumble, questionsShortcutOptions) {
        switch (questionsShortcutOptions) {
            case HumbleKitQuestionsShortcutOptions.AllQuestionsAmount:
                return this.getAllQuestionsAmount(data, alreadyHumble); //param is a full kit in kit compilation
            case HumbleKitQuestionsShortcutOptions.AmountByDifficulty:
                return this.getDetailedQuestionsAmount(data, alreadyHumble); //param is a humble kit from kits
        }
    }

    getDetailedQuestionsAmount(data, alreadyHumble) {
        return {
            hard: alreadyHumble //check if param is extended model
                ? data.numberOfHardQuestions //param is humble model from backend
                : this.getQuestionsAmountTypeByKitInputType(data.isReserve).Hard, //param is extended model

            medium: alreadyHumble
                ? data.numberOfMediumQuestions
                : this.getQuestionsAmountTypeByKitInputType(data.isReserve).Medium,

            easy: alreadyHumble
                ? data.numberOfEasyQuestions
                : this.getQuestionsAmountTypeByKitInputType(data.isReserve).Easy,
        };
    }

    getAllQuestionsAmount(data, alreadyHumble) {
        //if needs to convert HumbleKit model with detailed questions
        if (alreadyHumble && data.questionsAmount) {
            return data.questionsAmount.easy + data.questionsAmount.medium + data.questionsAmount.hard;
        } else {
            return alreadyHumble ? data.questionsNumber : data.questions.length;
        }
    }

    getQuestionsAmountTypeByKitInputType(isReserve) {
        return isReserve ? GeneralKitQuestionsAmount : ReserveKitQuestionsAmount;
    }

    setNewId(kitStateModel, id) {
        kitStateModel.id = id;
        return kitStateModel;
    }

    prepareKitListForState(data, areKitsAlreadyHumble, kitQuestionsShortcutOptions) {
        let kitsToConvert;
        if (data.questionKits !== undefined) {
            kitsToConvert = data.questionKits;
        } //from kits module
        else {
            kitsToConvert = data;
        } //from any other place
        kitsToConvert = kitsToConvert.map((kit) => {
            return this.prepareHumbleKitStateModel(kit, areKitsAlreadyHumble, kitQuestionsShortcutOptions);
        });
        return kitsToConvert;
    }

    prepareKitShortcutModel(data) {
        const questionsIds = [];
        //taking questions ids
        if (data.questions) {
            data.questions.map(function (question) {
                questionsIds.push(question.id);
                return question;
            });
        }
        return {
            id: data.id,
            name: data.name,
            isReserve: data.isReserve,
            questionsIds: questionsIds,
        };
    }

    prepareKitForCompilations(kitStateModel) {
        return {
            id: kitStateModel.id,
            name: kitStateModel.name,
            isReserve: kitStateModel.isReserve,
            questions: kitStateModel.questions,
            isChosen: false,
        };
    }

    prepareHumbleKitForCompilations(kitStateModel) {
        return {
            id: kitStateModel.id,
            name: kitStateModel.name,
            isReserve: kitStateModel.isReserve,
            questionsAmount: kitStateModel.questionsAmount,
            isChosen: false,
        };
    }

    prepareKitListForCompilations(kitListFromState) {
        return kitListFromState.map((kitStateModel) => {
            return this.prepareHumbleKitForCompilations(kitStateModel);
        });
    }
}

export default new KitsDataService();
