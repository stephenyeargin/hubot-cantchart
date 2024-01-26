// Description:
//   Get a new excuse for why you can't get any work done
//
// Dependencies:
//   axios
//
// Configuration:
//  GITHUB_TOKEN
//
// Commands:
//   hubot can't chart -- get a new excuse for why you can't get any work done
//   hubot exuse -- put yourself on the can't chart 
//
// Author: stahnma, websages
//

// This is a script for Hubot that will get a random comment from a GitHub
// issue, in this case hard-coded to be issue#1 at websages/hates-sofware

/*jshint esversion: 6 */

module.exports = function(robot) {

  const axios = require('axios');

  const username = 'websages';
  const repository = 'hates-software';
  const issueNumber = 1;

  const baseURL = 'https://api.github.com/repos/';
  const authHeader = 'Bearer';
  const token = process.env.GITHUB_TOKEN || 'YOUR_ACCESS_TOKEN';
  if (token == 'YOUR_ACCESS_TOKEN' ) {
    robot.logger.error('GITHUB_TOKEN not set');
    return;
  }
  const url = `${baseURL}${username}/${repository}/issues/${issueNumber}/comments`;

  robot.respond(/\S*excuse\S*|\S*cant chart\S*|can\'t chart\S*/i, function(msg) {
    axios.get(url, {
        headers: {
          Authorization: `${authHeader} ${token}`,
        },
      })
      .then(response => {
        const comments = response.data;
        if(comments.length === 0) {
          console.log('No comments found for the specified issue.');
          process.exit(1);
        }

        const randomComment = comments[Math.floor(Math.random() * comments.length)];
        robot.logger.debug(`Author: ${randomComment.user.login}`);
        robot.logger.debug(`Comment Body: ${randomComment.body}`);
        msg.send('"' + randomComment.body + '" -- ' + randomComment.user.login);

      })
      .catch(error => {
        console.error('Error making request:', error.message);
        process.exit(1);
      });
  });
};
