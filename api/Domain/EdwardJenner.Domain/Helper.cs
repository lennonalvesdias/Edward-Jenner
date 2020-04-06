using System;
using System.Text;

namespace EdwardJenner.Domain
{
    public static class Helper
    {
        public static string GenerateHash(string password)
        {
            try
            {
                var md5 = System.Security.Cryptography.MD5.Create();
                var inputBytes = Encoding.ASCII.GetBytes(password);
                var hash = md5.ComputeHash(inputBytes);
                var sb = new StringBuilder();
                foreach (var t in hash)
                {
                    sb.Append(t.ToString("X2"));
                }
                return sb.ToString();
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
