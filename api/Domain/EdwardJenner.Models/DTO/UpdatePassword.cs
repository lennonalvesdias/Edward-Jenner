using Newtonsoft.Json;

namespace EdwardJenner.Models.DTO
{
    public class UpdatePassword
    {
        [JsonProperty("oldPassword")]
        public string OldPassword { get; set; }

        [JsonProperty("newPassword")]
        public string NewPassword { get; set; }
    }
}
