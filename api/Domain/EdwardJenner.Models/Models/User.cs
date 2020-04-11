using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.GeoJsonObjectModel;
using Newtonsoft.Json;

namespace EdwardJenner.Models.Models
{
    public class User : ModelBase
    {
        [MinLength(2, ErrorMessage = "O nome deve conter ao menos 2 letras.")]
        [MaxLength(250, ErrorMessage = "O nome deve conter no máximo 250 letras.")]
        [Required(ErrorMessage = "O nome é obrigatório.")]
        [JsonProperty("name")]
        [BsonElement("name")]
        public string Name { get; set; }

        [MinLength(2, ErrorMessage = "O apelido deve conter ao menos 2 letras.")]
        [MaxLength(50, ErrorMessage = "O apelido deve conter no máximo 50 letras.")]
        [Required(ErrorMessage = "O apelido é obrigatório.")]
        [JsonProperty("username")]
        [BsonElement("username")]
        public string Username { get; set; }

        [MinLength(2, ErrorMessage = "O e-mail deve conter ao menos 2 letras.")]
        [MaxLength(50, ErrorMessage = "O e-mail deve conter no máximo 50 letras.")]
        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [RegularExpression(".+\\@.+\\.com(\\.br)?$", ErrorMessage = "O seu e-mail não é valido.")]
        [JsonProperty("email")]
        [BsonElement("email")]
        public string Email { get; set; }

        [MinLength(2, ErrorMessage = "A senha deve conter ao menos 2 letras.")]
        [MaxLength(50, ErrorMessage = "A senha deve conter no máximo 50 letras.")]
        [Required(ErrorMessage = "A senha é obrigatória.")]
        [JsonProperty("password")]
        [BsonElement("password")]
        public string Password { get; set; }

        [JsonProperty("avatar")]
        [BsonElement("avatar")]
        public string Avatar { get; set; }

        [JsonProperty("cpf")]
        [BsonElement("cpf")]
        public string Cpf { get; set; }

        [JsonProperty("addresses")]
        [BsonElement("addresses")]
        public IList<Address> Addresses { get; set; }

        [JsonProperty("phones")]
        [BsonElement("phones")]
        public IList<Phone> Phones { get; set; }

        [JsonProperty("applicationUserId")]
        [BsonElement("applicationUserId")]
        public string ApplicationUserId { get; set; }

        [JsonProperty("type")]
        [BsonElement("type")]
        public UserType Type { get; set; }

        [JsonProperty("birthday")]
        [BsonElement("birthday")]
        public DateTime Birthday { get; set; }

        [JsonProperty("about")]
        [BsonElement("about")]
        public string About { get; set; }

        [JsonProperty("ratings")]
        [BsonIgnore]
        public IList<Rating> Ratings { get; set; }

        [JsonProperty("hiddenOrders")]
        [BsonElement("hiddenOrders")]
        [BsonRepresentation(BsonType.ObjectId)]
        public IList<string> HiddenOrders { get; set; }

        [JsonProperty("distance")]
        [BsonElement("distance")]
        public int Distance { get; set; }
    }

    public enum UserType
    {
        [Description("Cliente")]
        [JsonProperty("customer")]
        Customer = 0,

        [Description("Ajudante")]
        [JsonProperty("helper")]
        Helper = 1,

        [Description("Vendedor")]
        [JsonProperty("seller")]
        Seller = 2
    }

    public class Address
    {
        [Required(ErrorMessage = "O país é obrigatório.")]
        [JsonProperty("country")]
        [BsonElement("country")]
        public string Country { get; set; }

        [Required(ErrorMessage = "O estado é obrigatório.")]
        [JsonProperty("state")]
        [BsonElement("state")]
        public string State { get; set; }

        [Required(ErrorMessage = "A cidade é obrigatória.")]
        [JsonProperty("city")]
        [BsonElement("city")]
        public string City { get; set; }

        [Required(ErrorMessage = "O bairro é obrigatório.")]
        [JsonProperty("neighborhood")]
        [BsonElement("neighborhood")]
        public string Neighborhood { get; set; }

        [Required(ErrorMessage = "A rua é obrigatória.")]
        [JsonProperty("street")]
        [BsonElement("street")]
        public string Street { get; set; }

        [JsonProperty("complement")]
        [BsonElement("complement")]
        public string Complement { get; set; }

        [JsonProperty("number")]
        [BsonElement("number")]
        public string Number { get; set; }

        [JsonProperty("longitude")]
        [BsonIgnore]
        public double Longitude { get; set; }

        [JsonProperty("latitude")]
        [BsonIgnore]
        public double Latitude { get; set; }

        [JsonIgnore]
        [BsonElement("location")]
        public GeoJsonPoint<GeoJson2DGeographicCoordinates> Location { get; set; }

        [JsonProperty("type")]
        [BsonElement("type")]
        public AddressType Type { get; set; }
    }

    public enum AddressType
    {
        [Description("Casa")]
        [JsonProperty("home")]
        Home = 0,

        [Description("Trabalho")]
        [JsonProperty("work")]
        Work = 1,

        [Description("Outro")]
        [JsonProperty("other")]
        Other = 2
    }

    public class Phone
    {
        [Required(ErrorMessage = "O DDD é obrigatório.")]
        [JsonProperty("ddd")]
        [BsonElement("ddd")]
        public string Ddd { get; set; }

        [Required(ErrorMessage = "O número é obrigatório.")]
        [JsonProperty("number")]
        [BsonElement("number")]
        public string Number { get; set; }

        [JsonProperty("type")]
        [BsonElement("type")]
        public PhoneType Type { get; set; }
    }

    public enum PhoneType
    {
        [Description("Casa")]
        [JsonProperty("home")]
        Home = 0,

        [Description("Celular")]
        [JsonProperty("mobile")]
        Mobile = 1
    }
}
