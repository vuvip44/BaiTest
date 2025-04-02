using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace WebApplication1.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Tài khoản không được để trống")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Họ tên không được để trống")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Ngày sinh không được để trống")]
        public DateTime DateOfBirth { get; set; }

        public bool IsMale { get; set; }

        [Required(ErrorMessage = "Số điện thoại không được để trống")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Email không được để trống")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        public string Email { get; set; }

        public int OrderNumber { get; set; }

        [Required(ErrorMessage = "Nhóm không được để trống")]
        public int GroupId { get; set; }

        [JsonIgnore]
        public virtual Group? Group { get; set; }
    }
} 