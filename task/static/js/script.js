$(document).ready(function () {
  $("#searchInput").on("keyup", function () {
    const searchTerm = $(this).val().toLowerCase();
    // Loop through each 'li' element
    $("ul.connectedSortable li.draggable").each(function () {
      const text = $(this).text().toLowerCase();
      // Check if the 'li' text contains the search term
      if (text.indexOf(searchTerm) === -1) {
        // Hide 'li' if it does not contain the search term
        $(this).hide();
      } else {
        // Show 'li' if it contains the search term
        $(this).show();
      }
    });
  });

  $.each(["in_progress", "completed", "overdue"], function (_, status) {
    $.ajax({
      url: `/tasks/status/${status}`,
      type: "GET",
      dataType: "json", // added data type
      success: function (res) {
        $.each(res, function (index, task) {
          $(`#${status.replace("_", "-")}-tasks`).append(singleTask(task));
        });
      },
    });
  });

  // Open modal
  $("#openModal").click(function () {
    $("#modal").removeClass("hidden");
  });

  // Close modal on cancel button click or ESC key press
  $("#cancelModal, #closeModal").click(function () {
    $("#modal").addClass("hidden");
  });

  $(document).keydown(function (e) {
    if (e.keyCode === 27) {
      // ESC key
      $("#modal").addClass("hidden");
    }
  });

  // Initialize datepicker
  $("#dueDate").datepicker({
    minDate: 0, // Disable past dates
    dateFormat: "yy-mm-dd", // ISO format
  });

  // Save button functionality
  $("#saveModal").click(function () {
    const task = {
      title: $("#title").val(),
      description: $("#description").val(),
      priority: $("#priority").val().toUpperCase(),
      due_date: $("#dueDate").val(),
      category: $("#category").val(),
      assigned_to: +$("#userId").val(),
    };
    $.ajax({
      url: `/tasks/`,
      type: "POST",
      data: task,
      dataType: "json", // added data type
      success: function (res) {
        showToast("Task added succesfully", "success");
        location.reload();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.status);
        console.log(jqXHR.responseText);
        console.log(jqXHR);
      },
    });
    $("#modal").addClass("hidden");
  });

  $("ul.connectedSortable")
    .sortable({
      connectWith: "ul.connectedSortable",
      placeholder: "ui-state-highlight",
      receive: function (event, ui) {
        const taskId = ui.item.find("#taskId").val();
        const statusFrom = ui.sender.data("status");
        const statusTo = $(this).data("status");

        if (statusFrom !== statusTo) {
          updateTaskStatus(taskId, statusTo);
        }
      },
      stop: function (event, ui) {
        // Update the task's status in its data attribute
        ui.item.data("status", ui.item.closest("ul").attr("id"));
      },
    })
    .disableSelection();

  function updateTaskStatus(taskId, status) {
    console.log(taskId, status);
    $.ajax({
      url: `/tasks/${taskId}/`,
      type: "PATCH",
      data: { status },
      dataType: "json", // added data type
      success: function (res) {
        console.log("Task updated successfully");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.status);
        console.log(jqXHR.responseText);
        console.error("An error occured while updating task status");
      },
    });
  }

  // delete task functionality
  $("ul").on("click", ".delete-task-icon", function () {
    // Store the 'li' element
    const $task = $(this).closest("li");

    // Show the modal
    $("#delete-task-modal").show();

    // Handle the delete confirmation
    $("#delete-task").on("click", function () {
      // Delete the task
      $task.remove();
      // Hide the modal
      $("#delete-task-modal").hide();
      const taskId = $task.find("#taskId").val();
      $.ajax({
        url: `/tasks/${taskId}`,
        type: "DELETE",
        success: function (res) {
          console.log("Delete successful");
        },
      });
    });

    // Handle the cancel action
    $("#cancel-delete-task").on("click", function () {
      // Hide the modal
      $("#delete-task-modal").hide();
    });
  });
});

function singleTask(task) {
  return `
        <li class="max-w-sm rounded overflow-hidden shadow-lg mb-3 cursor-move draggable">
                                <div class="px-6 pt-4 pb-2 bg-white">
                                    <span class="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-2">${
                                      task["priority"]
                                    }</span>
                                    <span class="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-2">${formatDate(
                                      task["due_date"]
                                    )}</span>
                                    <span class="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-2">${
                                      task["category"]
                                    }</span>
                                </div>
                                <div class="px-6 py-4">
                                    <div class="font-bold text-xl mb-2">${
                                      task["title"]
                                    }</div>
                                    <p class="text-gray-700 text-base">
                                        ${task["description"]}
                                    </p>
                                </div>
                                <div class="flex justify-between items-baseline px-6 py-4">
                                    <div class="flex">
                    <span class="-ml-2 rounded-full border-2 border-white">
                      <img class="h-6 w-6 rounded-full object-cover" src="https://i.pravatar.cc/100" alt="avatar"/>
                    </span>
                                            <span class="-ml-2 rounded-full border-2 border-white">
                      <img class="h-6 w-6 rounded-full object-cover" src="https://i.pravatar.cc/100" alt="avatar"/>
                    </span>
                                            <span class="-ml-2 rounded-full border-2 border-white">
                      <img class="h-6 w-6 rounded-full object-cover" src="https://i.pravatar.cc/100" alt="avatar"/>
                    </span>
                                            <span class="-ml-2 rounded-full border-2 border-white">
                      <img class="h-6 w-6 rounded-full object-cover" src="https://i.pravatar.cc/100" alt="avatar"/>
                    </span>

                                    </div>

                                    <div class="mt-2">
                          <span class="px-2 py-1 leading-tight inline-flex items-center bg-teal-100 rounded">
                            <span class="text-sm ml-2 font-medium text-teal-900  cursor-pointer">
                            <i class="fa-regular fa-eye"></i>
                            </span>
                            <span id="edit-task" class="text-sm ml-2 font-medium text-teal-900  cursor-pointer">
                            <i class="fa-regular fa-pen-to-square"></i>
                            </span>
                            <span class="delete-task-icon text-sm ml-2 font-medium text-teal-900 cursor-pointer">
                            <i class="fa-regular fa-trash-can"></i>
                            </span>
                          </span>
                                    </div>
                                </div>
                                <input type="hidden" name="taskId" id="taskId" value="${
                                  task.id
                                }">    
                            </li>
                            
    `;
}

function formatDate(stringDate) {
  const date = new Date(stringDate);
  return date.toLocaleString("en-Us", { month: "short", day: "numeric" });
}