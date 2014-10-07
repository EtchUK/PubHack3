using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Caching;
using System.Runtime.InteropServices;
using System.Text;
using System.Web;
using System.Web.Http;
using RestSharp;

namespace AwkwardRoulette.Web.UI.api
{

    public class TwilioController : ApiController
    {

        readonly ObjectCache _cache = MemoryCache.Default;

        // GET api/<controller>/5
        [Route("api/twilio/{target}/{name}")]
        [HttpGet]
        public HttpResponseMessage Get(string target, string name)
        {
            try
            {
                var twiml = new Twilio.TwiML.TwilioResponse();


                var rand = new Random();

                switch (rand.Next(3))
                {
                    case 0:
                        //var p = new {'voice=man', "language=en-GB"};

                        twiml.Say(String.Format("Hi {0} this is {1}. Sorry to call, it's really embarrassing, but I've been arrested, please could you call me back asap", target, name));
                        break;

                    case 1:
                        twiml.Say(String.Format("Hi {0} this is {1}. I just needed to call and tell you that I'm your telephone man", target, name));
                        twiml.Say("You just show me where you want it and I'll put it where I can");
                        twiml.Say("I can put it in the bedroom, I can put it in the hall");
                        twiml.Say("I can put it in the bathroom, I can hang it on the wall");
                        twiml.Say("You can have it with a buzz, you can have it with a ring");
                        twiml.Say("Because-a hey baby, I'm your telephone man");
                        break;

                    case 2:
                        twiml.Say(String.Format("Hey {0} this is {1}. Just thought I should let you know you are AWESOME", target, name));
                        break;

                    case 3:
                        twiml.Say(String.Format("Hi {0} this is {1}.", target, name));
                        twiml.Say(
                            "I met this guy last night and he came back to mine, he liked the dominatrix sorta stuff. He handcuffed me to my bed and put things in places that I don't even wanna talk about, but lets just say it hurts to poo now... anyway he ended up leaving, and left me handcuffed and I can't reach the keys. Can you please come and help!?");
                        break;


                }
    



                var resp = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent("<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + twiml.ToString(), Encoding.UTF8, "text/xml")
                };
                return resp;
            }
            catch (Exception)
            {
                
            }

            var r = new HttpResponseMessage(HttpStatusCode.InternalServerError)
            {
                Content = new StringContent("exception", Encoding.UTF8, "text/xml")
            };
            return r;
        }


        // POST api/<controller>
        [Route("api/twilio")]
        [HttpPost]
        public void Post([FromBody]TwilioRequest data)
        {
            //var client = new TwilioRestClient("PNb41248c08e28a038fe6136e0e91b815f", "c4f66677f90dc9f9409100200ffcd3bf");

            var client = new RestClient("https://api.twilio.com");
            client.Authenticator = new HttpBasicAuthenticator("AC81bf6b2bc351bb8e35fb9e9f198d0dcc", "c4f66677f90dc9f9409100200ffcd3bf");
            var request = new RestRequest("/2010-04-01/Accounts/{AccountSid}/Calls");
            request.Method = Method.POST;

            var number = data.Number.Replace(" ", "").TrimStart('0');

            number = "+44" + number;

            var policy = new CacheItemPolicy();
            //var id = Guid.NewGuid().ToString();

            //_cache.Add(id + "_name", data.Name, policy);
            //_cache.Add(id + "_target", data.Target, policy);

            var baseUri = new Uri(Request.RequestUri.AbsoluteUri.Replace(Request.RequestUri.PathAndQuery, String.Empty));
            var resourceRelative = String.Format("~/API/Twilio/{0}/{1}", data.Target, data.Name);

            var url = new Uri(baseUri, VirtualPathUtility.ToAbsolute(resourceRelative));

            request.AddParameter("To", number);
            request.AddParameter("From", "+442380000337"); 
            request.AddParameter("Url", url.ToString());
            request.AddParameter("Method", "GET");

            request.AddUrlSegment("AccountSid", "AC81bf6b2bc351bb8e35fb9e9f198d0dcc");

            client.Execute(request);
        }


    }
}