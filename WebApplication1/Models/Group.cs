using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WebApplication1.Models
{
    public class Group
    {
        public Group()
        {
            Children = new List<Group>();
            Users = new List<User>();
        }

        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên nhóm là bắt buộc")]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mã nhóm là bắt buộc")]
        [StringLength(50)]
        public string Code { get; set; } = string.Empty;

        public int? ParentId { get; set; }

        [JsonIgnore]
        [ForeignKey("ParentId")]
        public virtual Group? Parent { get; set; }

        [JsonIgnore]
        public virtual ICollection<Group> Children { get; set; }

        [Required(ErrorMessage = "Số thứ tự là bắt buộc")]
        public int OrderNumber { get; set; }

        [JsonIgnore]
        public virtual ICollection<User> Users { get; set; }
    }
} 