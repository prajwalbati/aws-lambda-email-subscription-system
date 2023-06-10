const aws = require("aws-sdk");
const sns = new aws.SNS();
const axois = require("axios");

const subscribeEndpoint = "";

const publishToSNS = (message) => {
    sns.publish({
        Message: message,
        TopicArn: process.env.SNS_TOPIC_ARN
    }).promise();
};

const buildEmailBody = (id, form) => {
    return `
        Message: ${from.message}
        Name: ${form.name}
        Email: ${form.email}
        Service Information: ${id.sourceIp} - ${id.userAgent}
    `;
};

module.exports.staticMailer = async(event) => {
    console.log("Event: ", event);
    const data = JSON.parse(event.body);
    const emailBody = buildEmailBody(event.requestContext.identity, data);

    await publishToSNS(emailBody);

    await axois.post(subscribeEndpoint, {
        email: data.email
    }).then((response)=> {
        console.log(response);
    }).catch((err) => {
        console.error(err);
    });

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": false
        },
        body: JSON.stringify({message: "OK"})
    };

}