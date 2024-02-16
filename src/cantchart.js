// Description:
//   Get a new excuse for why you can not get any work done
//
// Configuration:
//  HUBOT_GITHUB_TOKEN - Personal access token for interacting with the GitHub API
//
// Commands:
//   hubot cant chart - get a new excuse for why you cant get any work done
//
// Author:
//   stahnma, websages
//
// Category: workflow

// This is a script for Hubot that will get a random comment from a GitHub
// issue, in this case hard-coded to be issue#1 at websages/hates-sofware

/*jshint esversion: 6 */

module.exports = function(robot) {
  const username = 'websages';
  const repository = 'hates-software';
  const issueNumber = 1;

  const baseURL = 'https://api.github.com/repos/';
  const authHeader = 'Bearer';
  const token = process.env.HUBOT_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
  const url = `${baseURL}${username}/${repository}/issues/${issueNumber}/comments`;

  /**
   * Check if configuration is set
   * @param {object} msg Hubot message envelope 
   * @returns void
   */
  const checkConfiguration = (msg) => {
    if (!token) {
      robot.logger.error('Neither `HUBOT_GITHUB_TOKEN` nor `GITHUB_TOKEN` set');
      msg.send('`HUBOT_GITHUB_TOKEN` is not set.');
      return false;
    }
    return true;
  }

  robot.respond(/\S*excuse\S*|\S*cant chart\S*|can\'t chart\S*/i, function(msg) {
    if (!checkConfiguration(msg)) {
      return;
    }
    robot.http(url)
      .header('Authorization', `${authHeader} ${token}`)
      .get()(function(err, _res, body) {
        if (err) {
          robot.logger.error(err);
          msg.send('Error making request: ' + err.message);
          return;
        }
        const comments = JSON.parse(body);
        if(comments.length === 0) {
          console.log('No comments found for the specified issue.');
          return;
        }

        const randomComment = comments[Math.floor(Math.random() * comments.length)];
        robot.logger.debug(`Author: ${randomComment.user.login}`);
        robot.logger.debug(`Comment Body: ${randomComment.body}`);
        msg.send('"' + randomComment.body + '" -- ' + randomComment.user.login);
      })
  });
};
