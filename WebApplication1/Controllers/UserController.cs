using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;

namespace WebApplication1.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UserController> _logger;

        public UserController(ApplicationDbContext context, ILogger<UserController> logger)
        {
            _context = context;
            _logger = logger;
        }

        public IActionResult Index(int? groupId)
        {
            try
            {
                if (groupId == null)
                {
                    return BadRequest("Vui lòng chọn nhóm trước khi xem danh sách người dùng");
                }

                var allGroupIds = new List<int> { groupId.Value };
                var childGroups = _context.Groups
                    .Where(g => g.ParentId == groupId)
                    .ToList();

                void GetChildGroupIds(int parentId)
                {
                    var children = _context.Groups.Where(g => g.ParentId == parentId).ToList();
                    foreach (var child in children)
                    {
                        allGroupIds.Add(child.Id);
                        GetChildGroupIds(child.Id);
                    }
                }

                GetChildGroupIds(groupId.Value);

                var users = _context.Users
                    .Where(u => allGroupIds.Contains(u.GroupId))
                    .Include(u => u.Group) 
                    .OrderBy(u => u.Group.Name)
                    .ThenBy(u => u.OrderNumber)
                    .ToList();

                if (Request.Headers["X-Requested-With"] == "XMLHttpRequest")
                {
                    return PartialView(users);
                }

                return View(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading users for group {GroupId}: {Message}", groupId, ex.Message);
                return BadRequest(new { error = "Có lỗi xảy ra khi tải danh sách người dùng" });
            }
        }

        [HttpPost]
        public IActionResult Create([FromBody] User user)
        {
            try
            {
                _logger.LogInformation("Received request to create user");
                _logger.LogInformation("User data: {User}", JsonSerializer.Serialize(user));

                if (user == null)
                {
                    _logger.LogWarning("User data is null");
                    return BadRequest(new { error = "Dữ liệu không hợp lệ" });
                }

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();
                    _logger.LogWarning("Model validation failed: {Errors}", string.Join(", ", errors));
                    return BadRequest(new { errors = errors });
                }

                // Validate required fields
                var validationErrors = new List<string>();

                if (string.IsNullOrWhiteSpace(user.Username))
                {
                    validationErrors.Add("Vui lòng nhập tên tài khoản");
                }
                else if (user.Username.Length > 50)
                {
                    validationErrors.Add("Tên tài khoản không được vượt quá 50 ký tự");
                }

                if (string.IsNullOrWhiteSpace(user.FullName))
                {
                    validationErrors.Add("Vui lòng nhập họ tên");
                }
                else if (user.FullName.Length > 100)
                {
                    validationErrors.Add("Họ tên không được vượt quá 100 ký tự");
                }

                if (user.DateOfBirth == default)
                {
                    validationErrors.Add("Vui lòng chọn ngày sinh");
                }
                else if (user.DateOfBirth > DateTime.Now)
                {
                    validationErrors.Add("Ngày sinh không được lớn hơn ngày hiện tại");
                }

                if (string.IsNullOrWhiteSpace(user.PhoneNumber))
                {
                    validationErrors.Add("Vui lòng nhập số điện thoại");
                }
                else if (!System.Text.RegularExpressions.Regex.IsMatch(user.PhoneNumber, @"^\d{10,11}$"))
                {
                    validationErrors.Add("Số điện thoại không hợp lệ (phải có 10-11 chữ số)");
                }

                if (string.IsNullOrWhiteSpace(user.Email))
                {
                    validationErrors.Add("Vui lòng nhập email");
                }
                else if (!System.Text.RegularExpressions.Regex.IsMatch(user.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                {
                    validationErrors.Add("Email không đúng định dạng");
                }
                else if (user.Email.Length > 100)
                {
                    validationErrors.Add("Email không được vượt quá 100 ký tự");
                }

                if (user.GroupId <= 0)
                {
                    validationErrors.Add("Vui lòng chọn nhóm");
                }
                else if (!_context.Groups.Any(g => g.Id == user.GroupId))
                {
                    validationErrors.Add("Nhóm không tồn tại");
                }

                if (validationErrors.Any())
                {
                    _logger.LogWarning("Validation failed: {Errors}", string.Join(", ", validationErrors));
                    return BadRequest(new { errors = validationErrors });
                }

                // Check if username exists
                if (_context.Users.Any(u => u.Username.ToLower() == user.Username.ToLower()))
                {
                    return BadRequest(new { error = "Tên tài khoản đã tồn tại" });
                }

                // Check if email exists
                if (_context.Users.Any(u => u.Email.ToLower() == user.Email.ToLower()))
                {
                    return BadRequest(new { error = "Email đã được sử dụng" });
                }

                // Check if phone number exists
                if (_context.Users.Any(u => u.PhoneNumber == user.PhoneNumber))
                {
                    return BadRequest(new { error = "Số điện thoại đã được sử dụng" });
                }

                var maxOrder = _context.Users
                    .Where(u => u.GroupId == user.GroupId)
                    .Select(u => u.OrderNumber)
                    .ToList() 
                    .DefaultIfEmpty(0)
                    .Max();

                user.OrderNumber = maxOrder + 1;

                _context.Users.Add(user);
                _context.SaveChanges();

                _logger.LogInformation("User created successfully: {User}", JsonSerializer.Serialize(user));

                return Ok(new { 
                    success = true, 
                    data = user, 
                    message = "Thêm người dùng thành công" 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user: {Message}", ex.Message);
                return BadRequest(new { error = "Có lỗi xảy ra khi tạo người dùng. Vui lòng thử lại sau." });
            }
        }

        [HttpPut]
        public IActionResult Edit([FromBody] User user)
        {
            if (user == null)
            {
                return BadRequest("Dữ liệu người dùng không hợp lệ");
            }

            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(string.Join("\n", errors));
            }

            try
            {
                var existingUser = _context.Users.Find(user.Id);
                if (existingUser == null)
                {
                    return NotFound("Không tìm thấy người dùng này");
                }

                if (existingUser.Username != user.Username &&
                    _context.Users.Any(u => u.Username == user.Username))
                {
                    return BadRequest("Tài khoản này đã được sử dụng");
                }

                if (existingUser.Email != user.Email &&
                    _context.Users.Any(u => u.Email == user.Email))
                {
                    return BadRequest("Email này đã được sử dụng");
                }

                existingUser.Username = user.Username;
                existingUser.FullName = user.FullName;
                existingUser.DateOfBirth = user.DateOfBirth;
                existingUser.IsMale = user.IsMale;
                existingUser.PhoneNumber = user.PhoneNumber;
                existingUser.Email = user.Email;

                _context.SaveChanges();

                return Json(new { success = true, data = existingUser, message = "Cập nhật người dùng thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi khi cập nhật người dùng: {ex.Message}");
            }
        }

        [HttpDelete]
        public IActionResult Delete(int id)
        {
            try
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        var user = _context.Users.Find(id);
                        if (user == null)
                        {
                            return NotFound("Không tìm thấy người dùng này");
                        }

                        
                        var usersToUpdate = _context.Users
                            .Where(u => u.GroupId == user.GroupId && u.OrderNumber > user.OrderNumber)
                            .OrderBy(u => u.OrderNumber);

                        foreach (var remainingUser in usersToUpdate)
                        {
                            remainingUser.OrderNumber--;
                        }

                        _context.Users.Remove(user);
                        _context.SaveChanges();
                        transaction.Commit();

                        return Json(new { success = true, message = "Xóa người dùng thành công" });
                    }
                    catch
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi khi xóa người dùng: {ex.Message}");
            }
        }

        [HttpGet]
        public IActionResult GetById(int id)
        {
            try
            {
                var user = _context.Users.Find(id);
                if (user == null)
                {
                    return NotFound("Không tìm thấy người dùng này");
                }

                return Json(user);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi khi tải thông tin người dùng: {ex.Message}");
            }
        }
    }
} 