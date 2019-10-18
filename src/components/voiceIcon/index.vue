<template>
    <div class="voice" :class="{'playing': isPlaying}" :style="{width: vwidth, height: vheight}">
        <div class="first" v-show="index%3>=0">
        </div>
        <div class="second" v-show="index%3>=1">
        </div>
        <div class="third" v-show="index%3>=2">
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            intervalId: null,
            index: 2,
        }
    },
    watch: {
        isPlaying: function(val, oldVal) {
            const self = this
            if(val) {
                this.intervalId = setInterval(function () {
                    self.index += 1
                }, 1000)
            } else {
                this.index = 2
                clearInterval(this.intervalId)
            }
        }
    },
    props: {
        isPlaying: Boolean,
        vwidth: {
            type: String,
            default: '50px'
        },
        vheight: {
            type: String,
            default: '40px'
        }
    }
}
</script>
<style lang="scss">
.voice {
    position: relative;
    .first {
        position: absolute;
        width: 60%;
        height: 40%;
        right: 0;
        top: 30%;
        border-radius: 1000px;
        border-left: 2px solid black;
        box-sizing: border-box;
    }
    .second {
        position: absolute;
        width: 80%;
        height: 60%;
        top: 20%;
        right: 0;
        border-radius: 1000px;
        border-left: 2px solid black;
        box-sizing: border-box;
    }
    .third {
        position: absolute;
        width: 100%;
        height: 80%;
        top: 10%;
        right: 0;
        border-radius: 1000px;
        border-left: 2px solid black;
        box-sizing: border-box;
    }
}
</style>