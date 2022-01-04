<template>
    <div class="d-flex flex-row justify-content-center align-items-center">
        <ul class="card-list">
            <li
                class="card card-item"
                :class="{ active: cell.active }"
                :key="index"
                :style="{
                    background: cell.color,
                    color: cell.active ? activeTeamColor : '#ffffff',
                }"
                @click="cell.active = !cell.active"
                v-for="(cell, index) in cells"
            >
                <strong>{{ cell.number }}</strong>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "GameField",
    props: {
        cells: {
            type: Array,
            required: true,
        },
        activeTeamColor: {
            type: String,
            required: true,
        },
    },
};
</script>

<style scoped lang="scss">
.card-list {
    font-size: 1.3em;
    display: grid;
    grid-gap: 5px;
    grid-template-columns: repeat(6, minmax(1px, 1fr));
}

.card-item {
    border: 1px solid dodgerblue;
    padding: 20px;
    text-align: center;
    vertical-align: middle;
}

ul {
    list-style-type: none;
    padding: 0;
    margin: 0 auto;
}

li {
    transition: all 400ms ease-in-out;
    cursor: pointer;
    border: 1px solid #2c3e50 !important;
}

.active {
    z-index: 100;
    transform: scale(1.1, 1.1);
    transition: transform 400ms ease-in-out;
}
</style>
