(() => {
  // Monday 星期一 Tuesday 星期二  Wednesday 星期三 Thursday 星期四 Friday 星期五 Saturday 星期六 Sunday 星期七 
  // January 一月 February 二月 March  三月 April 四月 May 五月 June 六月 July 七月 August 八月 September  九月  October 十月 November 十一月 December  十二月
  const week_en = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const week_ch = ['日', '一', '二', '三', '四', '五', '六']
  const month_en = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const month_ch = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  const calculator = document.getElementsByClassName('calculator')[0]
  const ctrBox = calculator.getElementsByClassName('control')[0]
  const weekBox = calculator.getElementsByClassName('week')[0]
  const dayBox = calculator.getElementsByClassName('day')[0]

  const timeYear = calculator.getElementsByClassName('year')[0]
  const timeMonth = calculator.getElementsByClassName('month')[0]

  const prevYear = calculator.getElementsByClassName('prev-year')[0]
  const prevMonth = calculator.getElementsByClassName('prev-month')[0]
  const nextYear = calculator.getElementsByClassName('next-year')[0]
  const nextMonth = calculator.getElementsByClassName('next-month')[0]

  const sureBtn = calculator.getElementsByClassName('sure')[0]
  const cancelBtn = calculator.getElementsByClassName('cancel')[0]

  const largeMonth = [0, 2, 4, 6, 7, 9, 11]
  const smallMonth = [1, 5, 8, 10]

  window.Calculator = {
    setting() {
      // 日期限制
      this.isRange = false
      // 最早日期
      this.frontDate = new Date('1970-1-1')
      this.frontYear = this.frontDate.getFullYear()
      this.frontMonth = this.frontDate.getMonth()
      this.frontDay = this.frontDate.getDate()
      // 最晚日期
      this.lastDate = new Date('4000-12-31')
      this.lastYear = this.lastDate.getFullYear()
      this.lastMonth = this.lastDate.getMonth()
      this.lastDay = this.lastDate.getDate()
    },
    init(el) {
      el && (this.el = el)
      this.nowDate = new Date()
      this.nowYear = this.nowDate.getFullYear()
      this.nowMonth = this.nowDate.getMonth()
      this.nowDay = this.nowDate.getDate()
      this.tempYear = this.nowYear
      this.tempMonth = this.nowMonth
      this.tempDay = this.nowDay
      this.selectYear = this.nowYear
      this.selectMonth = this.nowMonth
      this.selectDay = this.nowDay
      this.setPosition()
      this.renderWeek()
      this.reInit()
      this.bindEvent()
    },
    in_array(a, v) {
      let i;
      for (i = 0; i < a.length; i++) {
        if (v === a[i]) {
          return true;
        }
      }
      return false;
    },
    isLeapYear(Year) {
      if (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0)) {
        return (true) // 闰年
      } else {
        return (false) // 平年
      }
    },
    addZero(num) {
      num = parseInt(num)
      return num < 10 ? '0' + num : num
    },
    reInit() {
      dayBox.innerHTML = ''
      this.dayArr = []
      this.calcDate()
      this.setDayArr()
      this.renderDay()
      this.renderTime()
    },
    setPosition() {
      this.el.addEventListener('focus', e => {
        let cl = this.el.offsetLeft
        let ct = this.el.offsetTop
        let ch = this.el.offsetHeight
        calculator.style.position = 'absolute'
        calculator.style.margin = 0
        calculator.style.left = cl + 'px'
        calculator.style.top = ch + 'px'
        calculator.style.display = 'block'
        this.init()
      })
    },
    renderWeek() {
      weekBox.innerHTML = ''
      week_ch.forEach((item) => {
        let span = document.createElement('span');
        span.innerHTML = item
        weekBox.appendChild(span)
      })
    },
    calcDate() {
      // 计算本月一号是星期几
      let firstDate = new Date(this.tempYear, this.tempMonth, 1)
      let addDays = firstDate.getDay()
      for (let i = 0; i < addDays; i++) {
        this.dayArr.push('')
      }
    },
    setDayArr() {
      let month = 0
      if (this.in_array(largeMonth, this.tempMonth)) {
        month = 31
      } else if (this.in_array(smallMonth, this.tempMonth)) {
        month = 30
      } else {
        if (this.isLeapYear(this.tempYear)) {
          month = 29
        } else {
          month = 28
        }
      }
      for (let i = 1; i <= month; i++) {
        this.dayArr.push(i)
      }
      let diff = this.dayArr.length % 7
      let diffDays = diff === 0 ? 0 : 7 - diff
      for (let i = 0; i < diffDays; i++) {
        this.dayArr.push('')
      }
      // console.log(this.dayArr)
    },
    renderDay() {
      this.dayArr.forEach(item => {
        let li = document.createElement('li');
        li.innerHTML = item
        this.setDayCls(item, li)
        dayBox.appendChild(li)
      })
      // 每渲染一次，需要重新绑定选中事件
      this.selectDayEvent()
    },
    setDayCls(day, dom) {
      if (this.tempYear === this.nowYear && this.tempMonth === this.nowMonth && day === this.nowDay) {
        dom.className += 'now'
      } else if (this.tempYear === this.selectYear && this.tempMonth === this.selectMonth && day === this.selectDay) {
        dom.className += 'active'
      } else if (day === '') {
        dom.className += 'not'
      }
    },
    renderTime() {
      timeYear.innerHTML = this.addZero(this.tempYear) + '年'
      timeMonth.innerHTML = this.addZero(this.tempMonth + 1) + '月'
    },
    bindEvent() {
      prevYear.addEventListener('click', () => {
        this.tempYear -= 1
        this.reInit()
      })
      prevMonth.addEventListener('click', () => {
        this.tempMonth -= 1
        if (this.tempMonth === -1) {
          this.tempYear -= 1
          this.tempMonth = 11
        }
        this.reInit()
      })
      nextYear.addEventListener('click', () => {
        this.tempYear += 1
        this.reInit()
      })
      nextMonth.addEventListener('click', () => {
        this.tempMonth += 1
        if (this.tempMonth === 12) {
          this.tempYear += 1
          this.tempMonth = 0
        }
        this.reInit()
      })
      sureBtn.addEventListener('click', () => {
        calculator.style.display = 'none'
        this.el.value = this.selectYear + '-' + this.addZero(this.selectMonth + 1) + '-' + this.addZero(this.selectDay)
      })
      cancelBtn.addEventListener('click', () => {
        calculator.style.display = 'none'
      })
    },
    selectDayEvent() {
      // li绑定点击事件
      let list = calculator.getElementsByClassName('day')[0].children
      list = Array.prototype.slice.call(list)
      list.forEach(item => {
        item.addEventListener('click', () => {
          list.forEach(item => {
            item.className = item.className.replace(/active/, '')
          })
          if (item.innerHTML === '') {
            return
          }
          this.selectYear = this.tempYear
          this.selectMonth = this.tempMonth
          this.selectDay = parseInt(item.innerHTML)
          item.className += ' active'
          // console.log(this.selectYear + '', this.addZero(this.selectMonth + 1), this.addZero(this.selectDay))
        })
      })
    }
  }
})()
