import games from "@/app/admin/store/modules/games";
import gameHosts from "@/app/admin/store/modules/gameHosts";
import kitCompilations from "@/app/admin/store/modules/kitCompilations";
import kits from "@/app/admin/store/modules/kits";
import questions from "@/app/admin/store/modules/questions";
import questionTopics from "@/app/admin/store/modules/questionTopics";

export default {
    namespaced: true,
    modules: {
        games,
        gameHosts,
        kitCompilations,
        kits,
        questions,
        questionTopics,
    },
};
