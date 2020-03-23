﻿using System;
using System.Runtime.Serialization;

namespace EdwardJenner.Domain.Exceptions
{
    [Serializable]
    public class BadRequestException : SystemException
    {
        public BadRequestException() { }

        public BadRequestException(string message) : base(message) { }

        public BadRequestException(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected BadRequestException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}
