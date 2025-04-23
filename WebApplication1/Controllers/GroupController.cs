using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Repositories;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GroupController : Controller
    {
        private readonly IGroupRepository _groupRepository;

        
        public GroupController(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        
        [HttpGet]
        [Route("")]
        public async Task<ActionResult<IEnumerable<Group>>> Index()
        {
            var groups = await _groupRepository.GetAllAsync();
            return Ok(groups);
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<Group>> GetById(int id)
        {
            var group = await _groupRepository.GetByIdAsync(id);
            if (group == null)
            {
                return NotFound();
            }
            return Json(group);
        }

        
        [HttpPost]
        public async Task<ActionResult<Group>> Create([FromBody] Group group)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (await _groupRepository.ExistsAsync(group.Code))
            {
                ModelState.AddModelError("Code", "Mã nhóm đã tồn tại");
                return BadRequest(ModelState);
            }

            var createdGroup = await _groupRepository.AddAsync(group);
            return Json(new { success = true, data = createdGroup });
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(int id, [FromBody] Group group)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (await _groupRepository.ExistsAsync(group.Code, group.Id))
            {
                ModelState.AddModelError("Code", "Mã nhóm đã tồn tại");
                return BadRequest(ModelState);
            }

            await _groupRepository.UpdateAsync(group);
            return Json(new { success = true });
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _groupRepository.DeleteAsync(id);
            return Json(new { success = true });
        }

        
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Group>>> GetAll()
        {
            var groups = await _groupRepository.GetAllAsync();
            return Json(groups);
        }

        
    }
}