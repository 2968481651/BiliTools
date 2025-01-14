const { randomInt } = require('crypto');

module.exports = function () {
  /**
   * 是否开启风纪委员任务执行
   * @param {boolen} isOpenJuryVote
   */
  this.openJuryVote = isOpenJuryVote => {
    process.env.BILI_JURY_VOTE = `${isOpenJuryVote || false}`;
    return this;
  };

  /**
   * 更新组件名
   * @param {string} componentName
   */
  this.updateComponentName = scfName => {
    process.env.COMPONENT_NAME = `cbts_${scfName}`;
    return this;
  };

  /**
   * 函数名
   * @param {string} scfName (必须参数)
   */
  this.updateSCFName = scfName => {
    if (!scfName) {
      throw new Error('没有设置serverless函数名,无法进行部署');
    }
    process.env.SCF_NAME = scfName;
    return this;
  };

  /**
   * 函数运行地域(默认成都)
   * @param {string} region
   */
  this.updateRegion = region => {
    process.env.SCF_REGION = region || 'ap-chengdu';
    return this;
  };

  /**
   * 函数描述
   * @param {string} description
   */
  this.updateDescription = description => {
    process.env.SCF_DESCRIPTION =
      description || '可以填写识别该函数是哪个账号用';
    return this;
  };

  /**
   * 是否执行日常任务
   * @param {any} isRun
   */
  this.isRunDailyTask = isRun => {
    process.env.BILI_DAILY_RUN = isRun === false ? 'false' : 'true';
    return this;
  };

  /**
   * 提交时设置执行时间
   * @param {string} dailyRunTime 每日任务时间
   */
  this.randomDailyRunTime = dailyRunTime => {
    const BILI_DAILY_RUN_TIME = dailyRunTime || '17:30:00-23:40:00';
    const taskTime = BILI_DAILY_RUN_TIME.split('-');
    const startTime = taskTime[0].split(':');
    const endTime = taskTime[1].split(':');

    const hours = randomInt(+startTime[0] ?? 19, +endTime[0] + 1 ?? 24);
    let minutes = 0;
    if (hours == startTime[0]) {
      minutes = randomInt(+startTime[1], 60);
    } else if (hours == endTime[0]) {
      minutes = randomInt(+endTime[1] + 1);
    } else {
      minutes = randomInt(60);
    }
    let seconds = 0;
    if (hours == startTime[0]) {
      seconds = randomInt(+startTime[2], 60);
    } else if (hours == endTime[0]) {
      seconds = randomInt(+endTime[2] + 1);
    } else {
      seconds = randomInt(60);
    }

    process.env.BILI_DAILY_CRON_EXPRESSION = `${seconds} ${minutes} ${hours} * * * *`;
    return this;
  };

  /** 风纪任务随机时间设置 */
  this.randomJuryRunTime = juryRunTime => {
    juryRunTime = juryRunTime || '8-12/20-40';

    const time = juryRunTime.split('/').map(el => el.split('-'));

    const startHours = randomInt(+time[0][0], +time[0][1]), //10,11
      startMinutes = randomInt(6), // 0 - 5
      minutes = randomInt(+time[1][0], +time[1][1]),
      seconds = randomInt(60);

    const endHours = 6 + startHours;

    process.env.BILI_JURY_CRON_EXPRESSION = `${seconds} ${startMinutes}/${minutes} ${startHours}-${endHours} * * * *`;
    return this;
  };
};
