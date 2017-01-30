<template>
  <div class="compare">

    <section class="user-input">
      <md-layout md-gutter>
        <md-layout md-flex-xlarge="25" md-flex-large="25" md-flex-medium="10" md-flex-small="5" md-flex-xsmall="5"></md-layout>
        <md-layout md-flex-xlarge="50" md-flex-large="50" md-flex-medium="80" md-flex-small="90" md-flex-xsmall="90">
          <div class="input-flex-wrapper">
            <div class="input-flex-submit">
              <md-button class="submit-usernames md-icon-button md-primary" @click="swapNames">
                <md-icon>swap_horiz</md-icon>
              </md-button>
            </div>
            <md-input-container class="input-flex">
              <label>First Username</label>
              <md-input type="text" v-model="user_one"></md-input>
              <md-spinner :md-size="24" md-indeterminate class="md-accent" v-if="user_one_searching"></md-spinner>
            </md-input-container>
            <md-input-container class="input-flex">
              <label>Second Username</label>
              <md-input type="text" v-model="user_two"></md-input>
              <md-spinner :md-size="24" md-indeterminate class="md-accent" v-if="user_two_searching"></md-spinner>
            </md-input-container>
            <div class="input-flex-submit">
              <md-button class="submit-usernames md-icon-button md-raised md-primary" @click="usernameSubmit">
                <md-icon>arrow_forward</md-icon>
              </md-button>
            </div>
          </div>
        </md-layout>
        <md-layout md-flex-xlarge="25" md-flex-large="25" md-flex-medium="10" md-flex-small="5" md-flex-xsmall="5"></md-layout>
      </md-layout>
    </section>

    <md-whiteframe md-elevation="4">
      <md-tabs md-centered>
        <md-tab md-label="Default" md-icon="equalizer">
          <section class="compare-charts">
            <div class="fifty-percent-line"></div>
            <div v-for="i in order_default" class="outer-bar">
              <md-ink-ripple />
              <div class="bar-exp-one"><md-icon :md-src="stats[i.i].icon"> </md-icon><span class="exp-text">{{addCommas(user_one_exp[i.i])}}</span></div>
              <div class="bar-exp-two"><span class="exp-text">{{addCommas(user_two_exp[i.i])}}</span><md-icon :md-src="stats[i.i].icon"></div>
              <div class="inner-bar" :style="{width: expOneToPercent(user_one_exp[i.i], user_two_exp[i.i]) + '%'}"></div>
            </div>
          </section>
        </md-tab>

        <md-tab md-label="Experience" md-icon="star_rate">
          <section class="compare-charts">
            <div class="fifty-percent-line"></div>
            <div v-for="i in order_experience" class="outer-bar">
              <md-ink-ripple />
              <div class="bar-exp-one"><md-icon :md-src="stats[i.i].icon"> </md-icon><span class="exp-text">{{addCommas(user_one_exp[i.i])}}</span></div>
              <div class="bar-exp-two"><span class="exp-text">{{addCommas(user_two_exp[i.i])}}</span><md-icon :md-src="stats[i.i].icon"></div>
              <div class="inner-bar" :style="{width: expOneToPercent(user_one_exp[i.i], user_two_exp[i.i]) + '%'}"></div>
            </div>
          </section>
        </md-tab>

        <md-tab md-label="Winning" md-icon="arrow_upward">
          <section class="compare-charts">
            <div class="fifty-percent-line"></div>
            <div v-for="i in order_winning" class="outer-bar">
              <md-ink-ripple />
              <div class="bar-exp-one"><md-icon :md-src="stats[i.i].icon"> </md-icon><span class="exp-text">{{addCommas(user_one_exp[i.i])}}</span></div>
              <div class="bar-exp-two"><span class="exp-text">{{addCommas(user_two_exp[i.i])}}</span><md-icon :md-src="stats[i.i].icon"></div>
              <div class="inner-bar" :style="{width: expOneToPercent(user_one_exp[i.i], user_two_exp[i.i]) + '%'}"></div>
            </div>
          </section>
        </md-tab>
      </md-tabs>
    </md-whiteframe>

    <section class="footer">
      The footer thing.
    </section>

  </div>
</template>

<script>
export default {
  name: 'compare',
  created: function () {
    let path = window.location.hash
    let params = path.replace('#', '').split('/')
    if (params[0] && params[0] !== '') this.user_one = params[0]
    if (params[1] && params[1] !== '') this.user_two = params[1]

    if (this.user_one !== '' || this.user_two !== '') this.usernameSubmit()
  },
  methods: {
    swapNames: function () {
      let x = this.user_one
      this.user_one = this.user_two
      this.user_two = x
      this.usernameSubmit()
    },
    addCommas: function (num) {
      num = '' + num;
      return num.replace(/(\d)(?=(\d{3})+$)/g, '$1,')
    },
    expOneToPercent: function(one, two) {
      if (one < 1 && two < 1) return 50
      let units = 100 / (one + two)
      return Math.round((one * units) * 100) / 100
    },
    usernameSubmit: function (e) {
      this.user_one_searching = true
      this.getUser(this.user_one, (data) => {
        if (data) {
          // Reset order other tabs
          this.order_experience.sort((a, b) => {
            if (a.i < b.i) return -1 // low to high
            if (a.i > b.i) return 1
            return 0
          })
          this.order_winning.sort((a, b) => {
            if (a.i < b.i) return -1 // low to high
            if (a.i > b.i) return 1
            return 0
          })

          // Enter new values
          let splitNewline = data.split(/\r?\n/)
          for (let i = 0; i <= 23; i++) {
            this.user_one_exp[i] = parseInt(splitNewline[i].split(',').pop())
            this.order_default[i].v = i
            this.order_experience[i].v = this.user_one_exp[i]
            this.order_winning[i].v = this.expOneToPercent(this.user_one_exp[i], this.user_two_exp[i])
          }

          // Sort other tabs
          this.order_experience.sort((a, b) => {
            if (a.v < b.v) return 1 // high to low
            if (a.v > b.v) return -1
            return 0
          })
          this.order_winning.sort((a, b) => {
            if (a.v < b.v) return 1 // high to low
            if (a.v > b.v) return -1
            return 0
          })
        } else {
          for (let i = 0; i < this.user_one_exp.length; i++) {
            this.user_one_exp[i] = 0;
          }
        }

        this.user_one_searching = false
      })

      this.user_two_searching = true
      this.getUser(this.user_two, (data) => {
        if (data) {
          // Reset order other tabs
          // This is duplicated from user_one event because both users are required for winning tab
          // The last of the two users to compute winning will be the correct one
          this.order_winning.sort((a, b) => {
            if (a.i < b.i) return -1 // low to high
            if (a.i > b.i) return 1
            return 0
          })

          // Enter new values
          let splitNewline = data.split(/\r?\n/)
          for (let i = 0; i <= 23; i++) {
            this.user_two_exp[i] = parseInt(splitNewline[i].split(',').pop())
            this.order_winning[i].v = this.expOneToPercent(this.user_one_exp[i], this.user_two_exp[i])
          }

          // Sort other tabs
          this.order_winning.sort((a, b) => {
            if (a.v < b.v) return 1 // high to low
            if (a.v > b.v) return -1
            return 0
          })
        } else {
          for (let i = 0; i < this.user_two_exp.length; i++) {
            this.user_two_exp[i] = 0;
          }
        }

        this.user_two_searching = false
      })
    },
    getUser: function (username, callback) {
      let osrsurl = 'http://services.runescape.com/m=hiscore_oldschool/index_lite.ws?player=' + username.replace(' ', '_');
      let yqlurl = 'http://query.yahooapis.com/v1/public/yql';
      let query = {q: 'select * from html where url="' + osrsurl +'"', format: 'json'};
      this.$http.get(yqlurl, {params: query}).then(response => {
        let r = response.body.query.results
        if (r) callback(r.body)
        else callback(null)
      }, response => { callback(null); /* error callback */ });
    }
  },
  data () {
    return {
      user_one: "",
      user_two: "",
      user_one_searching: false,
      user_two_searching: false,
      user_one_exp: new Array(24+1).join('0').split('').map(parseFloat),
      user_two_exp: new Array(24+1).join('0').split('').map(parseFloat),
      order_default: [{v: 0, i: 0}, {v: 0, i: 1}, {v: 0, i: 2}, {v: 0, i: 3}, {v: 0, i: 4}, {v: 0, i: 5}, {v: 0, i: 6}, {v: 0, i: 7}, {v: 0, i: 8}, {v: 0, i: 9}, {v: 0, i: 10}, {v: 0, i: 11}, {v: 0, i: 12}, {v: 0, i: 13}, {v: 0, i: 14}, {v: 0, i: 15}, {v: 0, i: 16}, {v: 0, i: 17}, {v: 0, i: 18}, {v: 0, i: 19}, {v: 0, i: 20}, {v: 0, i: 21}, {v: 0, i: 22}, {v: 0, i: 23}],
      order_experience: [{v: 0, i: 0}, {v: 0, i: 1}, {v: 0, i: 2}, {v: 0, i: 3}, {v: 0, i: 4}, {v: 0, i: 5}, {v: 0, i: 6}, {v: 0, i: 7}, {v: 0, i: 8}, {v: 0, i: 9}, {v: 0, i: 10}, {v: 0, i: 11}, {v: 0, i: 12}, {v: 0, i: 13}, {v: 0, i: 14}, {v: 0, i: 15}, {v: 0, i: 16}, {v: 0, i: 17}, {v: 0, i: 18}, {v: 0, i: 19}, {v: 0, i: 20}, {v: 0, i: 21}, {v: 0, i: 22}, {v: 0, i: 23}],
      order_winning: [{v: 0, i: 0}, {v: 0, i: 1}, {v: 0, i: 2}, {v: 0, i: 3}, {v: 0, i: 4}, {v: 0, i: 5}, {v: 0, i: 6}, {v: 0, i: 7}, {v: 0, i: 8}, {v: 0, i: 9}, {v: 0, i: 10}, {v: 0, i: 11}, {v: 0, i: 12}, {v: 0, i: 13}, {v: 0, i: 14}, {v: 0, i: 15}, {v: 0, i: 16}, {v: 0, i: 17}, {v: 0, i: 18}, {v: 0, i: 19}, {v: 0, i: 20}, {v: 0, i: 21}, {v: 0, i: 22}, {v: 0, i: 23}],
      stats: [
        {title: 'Total EXP', icon: '/static/icon/Skills-icon.png'},
        {title: 'Attack', icon: '/static/icon/Attack-icon.png'},
        {title: 'Defence', icon: '/static/icon/Defence-icon.png'},
        {title: 'Strength', icon: '/static/icon/Strength-icon.png'},
        {title: 'Hitpoints', icon: '/static/icon/Hitpoints-icon.png'},
        {title: 'Ranged', icon: '/static/icon/Ranged-icon.png'},
        {title: 'Prayer', icon: '/static/icon/Prayer-icon.png'},
        {title: 'Magic', icon: '/static/icon/Magic-icon.png'},
        {title: 'Cooking', icon: '/static/icon/Cooking-icon.png'},
        {title: 'Woodcutting', icon: '/static/icon/Woodcutting-icon.png'},
        {title: 'Fletching', icon: '/static/icon/Fletching-icon.png'},
        {title: 'Fishing', icon: '/static/icon/Fishing-icon.png'},
        {title: 'Firemaking', icon: '/static/icon/Firemaking-icon.png'},
        {title: 'Crafting', icon: '/static/icon/Crafting-icon.png'},
        {title: 'Smithing', icon: '/static/icon/Smithing-icon.png'},
        {title: 'Mining', icon: '/static/icon/Mining-icon.png'},
        {title: 'Herblore', icon: '/static/icon/Herblore-icon.png'},
        {title: 'Agility', icon: '/static/icon/Agility-icon.png'},
        {title: 'Thieving', icon: '/static/icon/Thieving-icon.png'},
        {title: 'Slayer', icon: '/static/icon/Slayer-icon.png'},
        {title: 'Farming', icon: '/static/icon/Farming-icon.png'},
        {title: 'Runecrafting', icon: '/static/icon/Runecrafting-icon.png'},
        {title: 'Hunter', icon: '/static/icon/Hunter-icon.png'},
        {title: 'Construction', icon: '/static/icon/Construction-icon.png'}
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.user-input { // the container
  padding: 48px 0;
}
button.submit-usernames { // the button
  margin: 15px 5px;
}
.input-flex-wrapper {
  flex: 1;

  @media (min-width: 480px) {
    display: flex;

    .input-flex {
      flex: 1;
      margin-left: 5px;
    }
    .input-flex-submit {

    }
  }
}
div.md-tab {
  padding: 0;
}
.compare-charts {
  position: relative;
}
.fifty-percent-line {
  width: 50%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  border-right: 1px solid white;
  z-index: 1000;
  opacity: 0.2;
  pointer-events: none;
}
.outer-bar {
  background-color: #E91E63;
  height: 36px;
  position: relative;
  outline: 3px solid rgba(0,0,0,0.15);
}
.inner-bar {
  background-color: #2196F3;
  height: 36px;
  width: 0%;
  transition: width 2s ease;
  pointer-events: none;
}
.bar-exp-one, .bar-exp-two {
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  font-size: 16px;
  line-height: 24px;
  padding: 6px;
  font-weight: bold;
  color: white;
  z-index: 100;
}
.bar-exp-one {
  left: 0;
}
.bar-exp-two {
  right: 0;
}
.footer {
  padding: 24px;
  text-align: center;
}
</style>
<style lang="scss">
.bar-exp-one, .bar-exp-two {
  opacity: 1;

  .exp-text {
    padding-left: 10px;
    padding-right: 10px;
    vertical-align: top;
  }
  .md-icon {
    vertical-align: top;
  }
}
</style>
