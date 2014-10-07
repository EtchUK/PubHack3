using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Caching;
using System.Text;
using System.Web;
using System.Web.Http;
//using Twilio;
//using Twilio.TwiML.WebApi;
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
                //var p = new {'voice=man', "language=en-GB"};

                twiml.Say(String.Format("Hi {0}, this is the custody sergeant at Hampshire Police.", target));
                twiml.Say(String.Format("{0} has been arrested and has asked you to come and deposit bail.", name));


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