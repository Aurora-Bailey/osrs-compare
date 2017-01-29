<template>
  <div class="compare">

    <section class="user-input">
      <md-layout md-gutter>
        <md-layout md-flex-xlarge="25" md-flex-large="25" md-flex-medium="10" md-flex-small="5" md-flex-xsmall="5"></md-layout>
        <md-layout md-flex-xlarge="50" md-flex-large="50" md-flex-medium="80" md-flex-small="90" md-flex-xsmall="90">
          <md-layout md-flex-xlarge="40" md-flex-large="40" md-flex-medium="40" md-flex-small="40" md-flex-xsmall="100">
            <md-input-container>
              <label>Username 1</label>
              <md-input type="text" v-model="user_one"></md-input>
              <md-icon class="md-primary" v-if="user_one_searching">autorenew</md-icon>
            </md-input-container>
          </md-layout>
          <md-layout md-flex-xlarge="40" md-flex-large="40" md-flex-medium="40" md-flex-small="40" md-flex-xsmall="100">
            <md-input-container>
              <label>Username 2</label>
              <md-input type="text" v-model="user_two"></md-input>
              <md-icon class="md-primary" v-if="user_two_searching">autorenew</md-icon>
            </md-input-container>
          </md-layout>
          <md-layout md-flex-xlarge="20" md-flex-large="20" md-flex-medium="20" md-flex-small="20" md-flex-xsmall="100">
            <div>
              <md-button class="submit-usernames md-raised md-primary" @click="usernameSubmit">
                Submit
              </md-button>
            </div>
          </md-layout>
        </md-layout>
        <md-layout md-flex-xlarge="25" md-flex-large="25" md-flex-medium="10" md-flex-small="5" md-flex-xsmall="5"></md-layout>
      </md-layout>
    </section>

    <section class="compare-charts">
      <div class="fifty-percent-line"></div>
      <div v-for="(item, i) in user_one_exp" class="outer-bar">
        <div class="bar-exp-one"><md-icon :md-src="user_one_exp[i].icon"> </md-icon><span class="exp-text">{{addCommas(user_one_exp[i].value)}}</span></div>
        <div class="bar-exp-two"><span class="exp-text">{{addCommas(user_two_exp[i].value)}}</span><md-icon :md-src="user_one_exp[i].icon"></div>
        <div class="inner-bar" :style="{width: expOneToPercent(user_one_exp[i].value, user_two_exp[i].value) + '%'}"></div>
      </div>
    </section>

    <section class="footer">
      The footer thing.
    </section>

  </div>
</template>

<script>
export default {
  name: 'compare',
  methods: {
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
          // Enter new values
          let splitNewline = data.split(/\r?\n/)
          for (let i = 0; i <= 23; i++) {
            this.user_one_exp[i].value = parseInt(splitNewline[i].split(',').pop())
          }
        } else {
          for (let i = 0; i < this.user_one_exp.length; i++) {
            this.user_one_exp[i].value = 0;
          }
        }

        this.user_one_searching = false
      })

      this.user_two_searching = true
      this.getUser(this.user_two, (data) => {
        if (data) {
          // Enter new values
          let splitNewline = data.split(/\r?\n/)
          for (let i = 0; i <= 23; i++) {
            this.user_two_exp[i].value = parseInt(splitNewline[i].split(',').pop())
          }
        } else {
          for (let i = 0; i < this.user_two_exp.length; i++) {
            this.user_two_exp[i].value = 0;
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
      user_one_exp: [
        {title: 'Total EXP', value: '0', icon: '../static/icon/Skills-icon.png'},
        {title: 'Attack', value: '0', icon: '../static/icon/Attack-icon.png'},
        {title: 'Defence', value: '0', icon: '../static/icon/Defence-icon.png'},
        {title: 'Strength', value: '0', icon: '../static/icon/Strength-icon.png'},
        {title: 'Hitpoints', value: '0', icon: '../static/icon/Hitpoints-icon.png'},
        {title: 'Ranged', value: '0', icon: '../static/icon/Ranged-icon.png'},
        {title: 'Prayer', value: '0', icon: '../static/icon/Prayer-icon.png'},
        {title: 'Magic', value: '0', icon: '../static/icon/Magic-icon.png'},
        {title: 'Cooking', value: '0', icon: '../static/icon/Cooking-icon.png'},
        {title: 'Woodcutting', value: '0', icon: '../static/icon/Woodcutting-icon.png'},
        {title: 'Fletching', value: '0', icon: '../static/icon/Fletching-icon.png'},
        {title: 'Fishing', value: '0', icon: '../static/icon/Fishing-icon.png'},
        {title: 'Firemaking', value: '0', icon: '../static/icon/Firemaking-icon.png'},
        {title: 'Crafting', value: '0', icon: '../static/icon/Crafting-icon.png'},
        {title: 'Smithing', value: '0', icon: '../static/icon/Smithing-icon.png'},
        {title: 'Mining', value: '0', icon: '../static/icon/Mining-icon.png'},
        {title: 'Herblore', value: '0', icon: '../static/icon/Herblore-icon.png'},
        {title: 'Agility', value: '0', icon: '../static/icon/Agility-icon.png'},
        {title: 'Thieving', value: '0', icon: '../static/icon/Thieving-icon.png'},
        {title: 'Slayer', value: '0', icon: '../static/icon/Slayer-icon.png'},
        {title: 'Farming', value: '0', icon: '../static/icon/Farming-icon.png'},
        {title: 'Runecrafting', value: '0', icon: '../static/icon/Runecrafting-icon.png'},
        {title: 'Hunter', value: '0', icon: '../static/icon/Hunter-icon.png'},
        {title: 'Construction', value: '0', icon: '../static/icon/Construction-icon.png'}
      ],
      user_two_exp: [
        {title: 'Total EXP', value: '0', icon: '../static/icon/Skills-icon.png'},
        {title: 'Attack', value: '0', icon: '../static/icon/Attack-icon.png'},
        {title: 'Defence', value: '0', icon: '../static/icon/Defence-icon.png'},
        {title: 'Strength', value: '0', icon: '../static/icon/Strength-icon.png'},
        {title: 'Hitpoints', value: '0', icon: '../static/icon/Hitpoints-icon.png'},
        {title: 'Ranged', value: '0', icon: '../static/icon/Ranged-icon.png'},
        {title: 'Prayer', value: '0', icon: '../static/icon/Prayer-icon.png'},
        {title: 'Magic', value: '0', icon: '../static/icon/Magic-icon.png'},
        {title: 'Cooking', value: '0', icon: '../static/icon/Cooking-icon.png'},
        {title: 'Woodcutting', value: '0', icon: '../static/icon/Woodcutting-icon.png'},
        {title: 'Fletching', value: '0', icon: '../static/icon/Fletching-icon.png'},
        {title: 'Fishing', value: '0', icon: '../static/icon/Fishing-icon.png'},
        {title: 'Firemaking', value: '0', icon: '../static/icon/Firemaking-icon.png'},
        {title: 'Crafting', value: '0', icon: '../static/icon/Crafting-icon.png'},
        {title: 'Smithing', value: '0', icon: '../static/icon/Smithing-icon.png'},
        {title: 'Mining', value: '0', icon: '../static/icon/Mining-icon.png'},
        {title: 'Herblore', value: '0', icon: '../static/icon/Herblore-icon.png'},
        {title: 'Agility', value: '0', icon: '../static/icon/Agility-icon.png'},
        {title: 'Thieving', value: '0', icon: '../static/icon/Thieving-icon.png'},
        {title: 'Slayer', value: '0', icon: '../static/icon/Slayer-icon.png'},
        {title: 'Farming', value: '0', icon: '../static/icon/Farming-icon.png'},
        {title: 'Runecrafting', value: '0', icon: '../static/icon/Runecrafting-icon.png'},
        {title: 'Hunter', value: '0', icon: '../static/icon/Hunter-icon.png'},
        {title: 'Construction', value: '0', icon: '../static/icon/Construction-icon.png'}
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.user-input {
  padding: 48px 0;
}
.submit-usernames {
  margin: 15px;
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
}
.outer-bar {
  background-color: #FF5722;
  height: 50px;
  // border: 2px solid white;
  position: relative;
  margin-bottom: 3px;
}
.inner-bar {
  background-color: #673ab7;
  height: 50px;
  width: 0%;
  transition: width 2s ease;
  // border-right: 2px solid white;
}
.bar-exp-one, .bar-exp-two {
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  font-size: 24px;
  line-height: 26px;
  padding: 12px;
  font-weight: bold;
  color: white;
  z-index: 100;

  .exp-text {
    padding-left: 10px;
    padding-right: 10px;
  }
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
