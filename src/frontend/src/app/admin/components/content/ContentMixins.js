import { mapActions, mapState } from "vuex";
import { FilterKitsOptions } from "@/app/admin/models/content/shared/FilterKitsOptions";

const offsetLimitRequestParams = {
    offset: 0,
    limit: 10,
    filter: 0,
};

export const KitsList = {
    data() {
        return {
            offsetLimitRequestParams,
        };
    },
    computed: {
        ...mapState({
            kitsList: (state) => state.admin.kits.all,
            kitQuestionsShortcut: (state) => state.admin.kits.kitQuestionsShortcut,
        }),
    },

    methods: {
        ...mapActions({
            fetchKits: "admin/kits/fetchKits",
        }),
        async refreshKitList() {
            await this.fetchKits(this.offsetLimitRequestParams);
        },
    },
};

export const CurrentKit = {
    computed: {
        ...mapState({
            currentKit: (state) => state.admin.kits.currentKit,
        }),
    },
    methods: {
        ...mapActions({
            fetchCurrentKit: "admin/kits/fetchCurrentKit",
        }),

        async setCurrentKit(kitId) {
            await this.fetchCurrentKit(kitId);
        },
    },
};

export const KitsFiltering = {
    data() {
        return {
            filterKitsOptions: FilterKitsOptions,
            offsetLimitRequestParams,
        };
    },
    methods: {
        async fetchFilteredKits(type) {
            this.offsetLimitRequestParams.filter = Object.values(this.filterKitsOptions).indexOf(type);
            await this.refreshKitList();
        },
    },
};

export const KitsFilterDropdown = {
    data() {
        return {
            filterKitsOptions: FilterKitsOptions,
            offsetLimitRequestParams,
            filterKits: "",
            filterKitsBackup: "",
        };
    },
    methods: {
        toggleTooltip() {
            if (this.filterKits !== this.filterKitsOptions.Tooltip) {
                this.filterKitsBackup = this.filterKits;
                this.filterKits = this.filterKitsOptions.Tooltip;
            } else {
                this.filterKits = this.filterKitsBackup;
            }
        },

        async showFilteredKits(type) {
            this.filterKits = type;
            this.filterKitsBackup = this.filterKits;
            await this.fetchFilteredKits(type);
        },
    },
};

export const KitCompilationsList = {
    data() {
        return {
            offsetLimitRequestParams: {
                offset: 0,
                limit: 20,
            },
        };
    },
    computed: {
        ...mapState({
            kitCompilationsList: (state) => state.admin.kitCompilations.all,
            kitQuestionsShortcut: (state) => state.admin.kitCompilations.kitQuestionsShortcut,
        }),
    },

    methods: {
        ...mapActions({
            fetchKitCompilations: "admin/kitCompilations/fetchKitCompilations",
        }),
        async refreshKitCompilationsList() {
            await this.fetchKitCompilations(this.offsetLimitRequestParams);
        },
    },
};

export const CurrentKitCompilation = {
    computed: {
        ...mapState({
            currentKitCompilation: (state) => state.admin.kitCompilations.currentKitCompilation,
        }),
    },
    methods: {
        ...mapActions({
            fetchCurrentKitCompilation: "admin/kitCompilations/fetchCurrentKitCompilation",
        }),

        async setCurrentKitCompilation(kitCompilationId) {
            await this.fetchCurrentKitCompilation(kitCompilationId);
        },
    },
};

export const KitsListKitCRUD = {
    methods: {
        ...mapActions({
            deleteKit: "admin/kits/deleteKit",
        }),

        async enterCreationPage(createAsReserveKit) {
            await this.$router.push({
                name: "KitCreation",
                params: { isReserveKitType: createAsReserveKit },
            });
        },

        async enterEditingPage(kitId) {
            await this.$router.push({ name: "KitEditing", params: { id: kitId } });
        },

        async deleteSelectedKit(kitId) {
            await this.deleteKit(kitId);
            await this.refreshKitList();
        },
    },
};

export const KitNameSubstrings = {
    methods: {
        shortName(str) {
            return str.substring(0, str.lastIndexOf("("));
        },

        firstQuestionBlockFromName(str) {
            return str.substring(str.lastIndexOf("(") + 1, str.indexOf("|") - 1); //first | occurrence
        },

        mediumQuestionBlockFromName(str) {
            const spareSubstring = str.substring(0, str.indexOf("|") + 1);
            str = str.replace(spareSubstring, "");
            return str.substring(0, str.indexOf("|") - 1); //second | occurrence
        },

        lastQuestionBlockFromName(str) {
            return str.substring(str.lastIndexOf("|") + 1, str.indexOf(")") - 1);
        },
    },
};

export const KitCompilationNameSubstrings = {
    methods: {
        shortName(str) {
            if (str.includes("(") && str.includes("|")) return str.substring(0, str.lastIndexOf("("));
            else return str;
        },
        bracketsDetails(str) {
            if (str.includes("(") && str.includes("|"))
                return str.substring(str.lastIndexOf("("), str.lastIndexOf(")") + 1);
            else return "";
        },
    },
};

export const PaginatedQuestions = {
    data() {
        return {
            questionListRequestParams: {
                offset: 0,
                limit: 0,
                newestFirst: false,
                difficulty: 0,
            },
            page: 1,
            pageSize: 4,
            pageSizes: [3, 4, 5, 6, 10],
        };
    },

    methods: {
        ...mapActions({
            fetchQuestions: "admin/questions/fetchQuestions",
        }),

        async fetchPaginatedQuestions() {
            this.setOffsetLimitRequestParams();
            await this.fetchQuestions(this.questionListRequestParams);
        },

        setOffsetLimitRequestParams() {
            this.questionListRequestParams.offset = (this.page - 1) * this.pageSize;
            this.questionListRequestParams.limit = this.pageSize;
        },

        async changePage(pageNumber) {
            this.page = pageNumber;
            await this.fetchPaginatedQuestions();
        },

        async changePageSize(evt) {
            this.pageSize = evt.target.value;
            //return to start
            this.page = 1;
            await this.fetchPaginatedQuestions();
        },

        async fetchFirstPage() {
            this.page = 1;
            await this.fetchPaginatedQuestions();
        },
    },
};

export const ToggleQuestionDetails = {
    data() {
        return {
            currentIndex: -1,
            currentQuestion: undefined,
        };
    },

    methods: {
        toggleItemDetails(question, index) {
            this.currentIndex === index ? this.closeItemDetails() : this.openItemDetails(question, index);
        },

        openItemDetails(question, index) {
            this.currentIndex = index;
            this.currentQuestion = question;
        },

        closeItemDetails() {
            this.currentIndex = -1;
            this.currentQuestion = undefined;
        },
    },
};
